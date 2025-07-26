This repository is a Next.JS application that combines multiple apps inside a single project.

Each app has its own backends that could be configured in a config.yml file in the root directory of the app.

A new app has to be registered in the src/apps/constants file.

Each app has its own directory inside the src/apps/(with-header) directory, which contains the app's specific routes.

Inside the src/apps/(with-header)/:appName directory, there is an additional directory with the [serviceId]. A page.tsx file inside the apps root directory handles redirection, when there is only one registered backend for the app.

Each app has its own directory inside the src/components/apps directory, which contains the app's specific components that could be reused inside the same app.

Each app has its own directory inside the src/components/services directory, which contains logic for fetching data from the backend.

When writing code inside an app route/service/server-component the utility fetchService could be used to load data from the corresponding backend.

There is a GeneratedForm component which should be primarily used when creating, updating or deleting data. When not applicable, use a form with formik, a server-action and a service.

When displaying alerts, always use the useOpenDialog hook with the AlertDialog component.

Use already existing components for buttons, inputs, drop-downs, etc. from src/components/universals.
