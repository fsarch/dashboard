import { EServiceType } from "@/utils/configuration.type";
import { AppDefinitionType } from "@/constants/app.type";
import { CustomerCommunicationAppDefinition } from "@/constants/apps/ccm/ccm.const";
import { DatatableAppDefinition } from "@/constants/apps/datatable/datatable.const";
import { ProductAppDefinition } from "@/constants/apps/product/product.const";
import { ImageAppDefinition } from "@/constants/apps/image/image.const";
import { MaterialTracingAppDefinition } from "@/constants/apps/material-tracing/material-tracing.const";
import { CustomAppAppDefinition } from "@/constants/apps/custom-app/custom-app.const";
import { PdfRenderAppDefinition } from "@/constants/apps/pdf-render/pdf-render.const";
import { FunctionAppDefinition } from "@/constants/apps/function/function.const";
import { FunctionGatewayAppDefinition } from "@/constants/apps/function-gateway/function-gateway.const";
import { PrinterAppDefinition } from "@/constants/apps/printer/printer.const";
import { AiAppDefinition } from "@/constants/apps/ai/ai.const";
import { EmailServerAppDefinition } from "@/constants/apps/email/email.const";
import { FrontierAppDefinition } from "@/constants/apps/frontier/frontier.const";
import { WatchtowerAppDefinition } from "@/constants/apps/watchtower/watchtower.const";
import { BotProtectionAppDefinition } from "@/constants/apps/bot-protection/bot-protection.const";
import { MetricAppDefinition } from "@/constants/apps/metric/metric.const";
import { FrontendAppDefinition } from "@/constants/apps/frontend/frontend.const";
import { CalendarAppDefinition } from "@/constants/apps/calendar/calendar.const";
import { DblightAppDefinition } from "@/constants/apps/dblight/dblight.const";
import { ImageEditorServerAppDefinition } from "@/constants/apps/image-editor-server/image-editor-server.const";

export const APPS: Record<EServiceType, AppDefinitionType> = {
  [EServiceType.CUSTOMER_COMMUNICATION]: CustomerCommunicationAppDefinition,
  [EServiceType.DATATABLE]: DatatableAppDefinition,
  [EServiceType.PIM]: ProductAppDefinition,
  [EServiceType.IMAGE]: ImageAppDefinition,
  [EServiceType.MATERIAL_TRACING]: MaterialTracingAppDefinition,
  [EServiceType.CUSTOM_APP]: CustomAppAppDefinition,
  [EServiceType.PDF_RENDER]: PdfRenderAppDefinition,
  [EServiceType.FUNCTION]: FunctionAppDefinition,
  [EServiceType.FUNCTION_GATEWAY]: FunctionGatewayAppDefinition,
  [EServiceType.PRINTER]: PrinterAppDefinition,
  [EServiceType.AI]: AiAppDefinition,
  [EServiceType.EMAIL_SERVER]: EmailServerAppDefinition,
  [EServiceType.FRONTIER]: FrontierAppDefinition,
  [EServiceType.WATCHTOWER]: WatchtowerAppDefinition,
  [EServiceType.BOT_PROTECTION]: BotProtectionAppDefinition,
  [EServiceType.METRIC]: MetricAppDefinition,
  [EServiceType.FRONTEND]: FrontendAppDefinition,
  [EServiceType.CALENDAR]: CalendarAppDefinition,
  [EServiceType.DBLIGHT]: DblightAppDefinition,
  [EServiceType.IMAGE_EDITOR_SERVER]: ImageEditorServerAppDefinition,
};
