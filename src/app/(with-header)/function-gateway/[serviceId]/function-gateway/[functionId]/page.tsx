import { functionGatewayService } from "@/services/function-gateway/function-gateway.service";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import Section from "@/components/universals/section/Section";
import FunctionGatewayExecuteForm from "./_components/ExecuteForm.component";

export default async function Home({ params }: { params: Promise<{ functionId: string }> }) {
  const functionId = (await params).functionId;
  const gatewayFunction = await functionGatewayService.getFunction(functionId);

  return (
    <DefaultPage>
      <Section name="Funktionsdetails">
        <div>
          <p><strong>ID:</strong> {gatewayFunction.id}</p>
          <p><strong>Name:</strong> {gatewayFunction.name || '-'}</p>
          <p><strong>Funktions-ID:</strong> {gatewayFunction.functionId}</p>
        </div>
      </Section>
      <Section name="Funktion ausführen">
        <FunctionGatewayExecuteForm functionId={functionId} />
      </Section>
    </DefaultPage>
  );
}
