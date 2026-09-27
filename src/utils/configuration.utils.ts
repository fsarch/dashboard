import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import Color from 'color';
import * as yaml from 'js-yaml';
import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import { headers } from 'next/headers';
import { APPS } from '@/constants/apps';
import type {
  EServiceType,
  TConfiguration,
  TServiceConfiguration,
} from '@/utils/configuration.type';
import { ServerLogger } from '@/utils/ServerLogger';

const YAML_CONFIG_FILENAME = 'config.yml';

let configuration: TConfiguration;

// Once `environments` is configured at all, every service must be assigned
// to one - a service with no environment would be unreachable from the
// environment switcher (see getEnvironmentSwitcherOptions), which is
// confusing enough to fail fast on rather than silently ignore.
function validateEnvironments(config: TConfiguration): void {
  if (!config.environments?.length) {
    return;
  }

  const missing = config.services
    .filter((s) => !s.environment)
    .map((s) => s.id);

  if (missing.length > 0) {
    throw new Error(
      `config.yml defines "environments", so every service needs an "environment" - missing on: ${missing.join(', ')}`,
    );
  }
}

export async function getConfiguration(): Promise<TConfiguration> {
  if (!configuration) {
    configuration = yaml.load(
      await readFile(
        resolve(
          process.cwd(),
          process.env.CONFIG_FILE_PATH || YAML_CONFIG_FILENAME,
        ),
        'utf8',
      ),
    ) as TConfiguration;
    validateEnvironments(configuration);
  }

  return configuration;
}

export async function getServiceConfiguration<T extends EServiceType>(
  type: T,
): Promise<(TServiceConfiguration & { type: T }) | undefined> {
  return (await getConfiguration()).services.find((s) => s.type === type) as
    | (TServiceConfiguration & { type: T })
    | undefined;
}

export async function getServiceConfigurations<T extends EServiceType>(
  type: T,
): Promise<Array<TServiceConfiguration & { type: T }>> {
  return (await getConfiguration()).services.filter(
    (s) => s.type === type,
  ) as Array<TServiceConfiguration & { type: T }>;
}

export async function getServiceConfigurationById(
  id: string,
): Promise<TServiceConfiguration | undefined> {
  return (await getConfiguration()).services.find((s) => s.id === id);
}

export async function getCurrentServiceId(): Promise<string> {
  return (await headers()).get('X-Service-Id')!;
}

export async function getCurrentServiceType(): Promise<EServiceType> {
  return (await headers()).get('X-Service-Type') as EServiceType;
}

export async function getDefaultServiceId(
  serviceType: EServiceType,
): Promise<string> {
  const defaultId = (await getConfiguration()).defaults[serviceType]?.id;
  if (!defaultId) {
    throw new Error('non-configured default service');
  }

  return defaultId;
}

export async function getCurrentServiceBaseConfiguration(): Promise<TServiceConfiguration> {
  const serviceId = (await headers()).get('X-Service-Id');

  const foundServiceType = (await getConfiguration()).services.find(
    (s) => s.id === serviceId,
  );

  if (!foundServiceType) {
    ServerLogger.Instance.debug(
      `could not get service configuration for {id}`,
      {
        serviceId,
      },
    );
    throw new PageNotFoundError('service configuration not found');
  }

  return foundServiceType;
}

export async function getCurrentServiceConfiguration<T extends EServiceType>(
  type: T,
): Promise<TServiceConfiguration & { type: T }> {
  const foundServiceType = await getCurrentServiceBaseConfiguration();

  if (foundServiceType.type !== type) {
    ServerLogger.Instance.debug(
      `could not get service configuration for {type}`,
      {
        type,
        foundServiceType,
      },
    );
    throw new PageNotFoundError('service configuration not found');
  }

  return foundServiceType as TServiceConfiguration & { type: T };
}

export type TEnvironmentSwitcherOption = {
  id: string;
  name: string;
  // Target to navigate to when this environment is picked: the app's root
  // for the one matching service if there's exactly one, otherwise the
  // app's own overview page (which lets the user pick between instances,
  // same as when opening /<app> directly with >1 configured instance).
  href: string;
};

export type TEnvironmentSwitcherConfiguration = {
  currentEnvironmentId: string;
  options: Array<TEnvironmentSwitcherOption>;
};

// Only offered for environments that have a matching service of the given
// type, since picking an environment only ever switches within one app type.
// `preferredEnvironmentId` is used as the select's current value when it's
// one of the resulting options (e.g. the "selected-environment" cookie
// ServiceSelectionPage filters by); otherwise the first option
// (alphabetically) wins.
// `overviewHref` is where a multi-match environment's option points to -
// defaults to the type's own basePath (its ServiceSelectionPage), but some
// callers list instances of a type inline on a page that isn't that
// basePath at all (e.g. the dashboard home page's "Custom Apps" section,
// for which there's no dedicated /custom-app overview route) and pass their
// own href instead.
export async function getEnvironmentSwitcherOptionsForType(
  serviceType: EServiceType,
  preferredEnvironmentId?: string,
  overviewHref?: string,
): Promise<TEnvironmentSwitcherConfiguration | null> {
  const config = await getConfiguration();
  if (!config.environments?.length) {
    return null;
  }

  const basePath = overviewHref ?? APPS[serviceType].basePath;

  const servicesByEnvironment = new Map<string, Array<TServiceConfiguration>>();
  for (const service of config.services) {
    if (service.type !== serviceType || !service.environment) {
      continue;
    }
    const services = servicesByEnvironment.get(service.environment) ?? [];
    services.push(service);
    servicesByEnvironment.set(service.environment, services);
  }

  if (servicesByEnvironment.size === 0) {
    return null;
  }

  const options: Array<TEnvironmentSwitcherOption> = Array.from(
    servicesByEnvironment.entries(),
  ).map(([environmentId, services]) => ({
    id: environmentId,
    name:
      config.environments?.find((e) => e.id === environmentId)?.name ??
      environmentId,
    // A single match goes straight to that service; multiple matches go to
    // the overview page, which filters by the "selected-environment" cookie
    // this option's pick also sets (see ServiceSelectionPage and
    // EnvironmentSwitcher).
    href:
      services.length === 1
        ? `${APPS[serviceType].basePath}/${services[0].id}`
        : basePath,
  }));

  // Nothing to switch to for this service type - showing a 1-option select
  // would just be noise.
  if (options.length <= 1) {
    return null;
  }

  options.sort((a, b) => a.name.localeCompare(b.name));

  const currentEnvironmentId =
    preferredEnvironmentId &&
    options.some((o) => o.id === preferredEnvironmentId)
      ? preferredEnvironmentId
      : options[0].id;

  return { currentEnvironmentId, options };
}

// Type-agnostic variant for pages that aren't scoped to one app type at all
// (the dashboard home page, listing every app type plus every custom-app
// instance side by side) - offers every configured environment rather than
// only the ones a specific type has instances in, since picking one here
// filters multiple independent lists on the same page instead of navigating
// to a single service or overview.
export async function getGlobalEnvironmentSwitcherOptions(
  preferredEnvironmentId?: string,
  href = '/',
): Promise<TEnvironmentSwitcherConfiguration | null> {
  const config = await getConfiguration();
  if (!config.environments || config.environments.length <= 1) {
    return null;
  }

  const options: Array<TEnvironmentSwitcherOption> = config.environments.map(
    (environment) => ({
      id: environment.id,
      name: environment.name,
      href,
    }),
  );

  const currentEnvironmentId =
    preferredEnvironmentId &&
    options.some((o) => o.id === preferredEnvironmentId)
      ? preferredEnvironmentId
      : options[0].id;

  return { currentEnvironmentId, options };
}

// Only offered when the current service itself has an `environment` set.
export async function getEnvironmentSwitcherOptions(): Promise<TEnvironmentSwitcherConfiguration | null> {
  let currentService: TServiceConfiguration;
  try {
    currentService = await getCurrentServiceBaseConfiguration();
  } catch {
    return null;
  }

  if (!currentService.environment) {
    return null;
  }

  return getEnvironmentSwitcherOptionsForType(
    currentService.type,
    currentService.environment,
  );
}

export async function getThemeConfiguration() {
  const theme = (await getConfiguration()).theme;

  const primaryColor = Color(theme?.primary_color ?? '#32a852');
  const backgroundColor = Color(theme?.background_color ?? '#1b1b1b');

  return {
    mode: backgroundColor.isDark() ? 'dark' : 'light',
    primaryColor: {
      hex: primaryColor.hex(),
      rgbComponents: primaryColor.rgb().array().join(', '),
    },
    backgroundColor: {
      hex: backgroundColor.hex(),
      rgbComponents: backgroundColor.rgb().array().join(', '),
    },
  };
}
