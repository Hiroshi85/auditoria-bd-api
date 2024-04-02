"use client";
import Spinner from "@/components/ui/spinner";
import { useSecuencia } from "../secuencia.context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ResultContainer } from "@/components/ui/result-container";

export default function SeqExceptionResults() {
  const { query } = useSecuencia();
  const { data, isLoading, isError } = query;

  function getTabColor(array: any[]) {
    return array.length > 0 && "text-red-600";
  }

  if (isLoading) {
    return (
      <ResultContainer>
        <Spinner className="mx-auto"/>
      </ResultContainer>
    )
  }

  if (isError){
    return (
      <ResultContainer type="error">
        <p className="text-red txt-md">Error al cargar los resultados</p>
      </ResultContainer>
    )
  }

  if (!data) {
    return (
      <ResultContainer>
        <p>Aquí se mostrarán los resultados de la ejecución</p>
      </ResultContainer>
    )
  }

  return (
    <div>
      { data.result === "error" ? (
        <ResultContainer type="error" className="text-red txt-md">{data.message}</ResultContainer>
      ) : (
        <ResultContainer type={data.result === "exception" ? "error" : "ok"}>
          <header className="space-y-4">
            <div className="flex flex-row justify-between">
              <div>
                <p>
                  <strong>Base de datos:</strong> {data.database}
                </p>
                <p>
                  <strong>Tabla: </strong> {data.table}
                </p>
              </div>
              <div>
                <p>
                  <strong>Fecha y hora:</strong> {data.datetime_analysis}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold bg-primary rounded-lg py-2 px-2 text-white relative">
                Detalles del análisis
                <Badge
                  variant={data.result === "ok" ? "outline" : "destructive"}
                  className="text-white absolute right-2 top-3"
                >
                  {data.result === "ok"
                    ? "Secuencia correcta"
                    : "Secuencia incorrecta"}
                </Badge>
              </h2>

              <div className="px-2 mt-2">
                <p>
                  <strong>Valor mínimo:</strong> {data.min}
                </p>
                <p>
                  <strong>Valor máximo:</strong> {data.max}
                </p>
              </div>
            </div>
          </header>
          {data.result === "exception" && (
            <main>
              <Tabs defaultValue="missing">
                <TabsList className="w-full mb-4 space-x-2 bg-transparent">
                  <TabsTrigger
                    value="missing"
                    className={cn(getTabColor(data.missing))}
                  >{`Registros faltantes ${data.num_missing}`}</TabsTrigger>
                  <TabsTrigger
                    value="repeated"
                    className={cn(getTabColor(data.duplicates))}
                  >{`Registros repeditos ${data.num_duplicates}`}</TabsTrigger>
                  <TabsTrigger
                    value="errors"
                    className={cn(getTabColor(data.sequence_errors))}
                  >{`Errores de secuencia ${data.num_sequence_errors}`}</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="missing"
                  className="flex flex-wrap gap-x-8 gap-y-8"
                >
                  {data.missing.map((item, index) => {
                    return (
                      <span key={item} className={"min-w-[60px]"}>
                        {item}
                      </span>
                    );
                  })}
                </TabsContent>
                <TabsContent
                  value="repeated"
                  className="flex flex-wrap gap-x-8 gap-y-8"
                >
                  {data.duplicates.map((item) => {
                    return <span key={item}>{item}</span>;
                  })}
                </TabsContent>
                <TabsContent value="errors">
                  <Table className="w-fit text-center">
                    <TableCaption>
                      Fin de lista de errores de secuencia.
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-80px">#</TableHead>
                        <TableHead>Valor esperado</TableHead>
                        <TableHead>Valor encontrado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.sequence_errors.map((item, index) => {
                        return (
                          <TableRow key={item.expected}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.expected}</TableCell>
                            <TableCell>{item.found}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </main>
          )}
        </ResultContainer>
      )}
    </div>
  );
}
