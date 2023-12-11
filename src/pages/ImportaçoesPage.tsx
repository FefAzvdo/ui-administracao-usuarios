import { Button, Table, Tabs } from "flowbite-react";
import MainLayout from "../components/MainLayout";
import { convertPhosphorIcon } from "../utils";
import { ClipboardText, Users } from "@phosphor-icons/react";

export default function ImportacoesPage() {
  return (
    <MainLayout pageTitle="Importações">
      <div>
        <div className="flex justify-end mb-2">
          <Button className="mr-2" onClick={() => {}}>
            Importar pedidos
          </Button>
          <Button onClick={() => {}}>Importar colaboradores</Button>
        </div>
      </div>
      <Tabs>
        <Tabs.Item
          title="Colaboradores"
          icon={convertPhosphorIcon(<Users size={25} />)}
        >
          <div className="overflow-x-auto">
            <Table>
              <Table.Head>
                <Table.HeadCell>Id</Table.HeadCell>
                <Table.HeadCell>Data importação</Table.HeadCell>
                <Table.HeadCell>Status importação</Table.HeadCell>
                <Table.HeadCell>Nome arquivo</Table.HeadCell>
                <Table.HeadCell>Lista de erros</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {[].map(() => (
                  <Table.Row>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Tabs.Item>
        <Tabs.Item
          title="Pedidos"
          icon={convertPhosphorIcon(<ClipboardText size={25} />)}
        >
          <div className="overflow-x-auto">
            <Table>
              <Table.Head>
                <Table.HeadCell>Id</Table.HeadCell>
                <Table.HeadCell>Data importação</Table.HeadCell>
                <Table.HeadCell>Status importação</Table.HeadCell>
                <Table.HeadCell>Nome arquivo</Table.HeadCell>
                <Table.HeadCell>Lista de erros</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {[].map(() => (
                  <Table.Row>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Tabs.Item>
      </Tabs>
    </MainLayout>
  );
}
