import React from "react";
import { Table } from "flowbite-react";
import { useAuth } from "@clerk/clerk-react";
import analysisService from "../../services/analysisService";
import { useQuery } from "react-query";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";

export default function Analysis() {
  const { userId, getToken } = useAuth();
  const cycleService = analysisService();

  const fetchRestAnalysis = async () => {
    const token = await getToken();
    return cycleService.getRestAnalysis(token, userId);
  };

  const fetchVolumeAnalysis = async () => {
    const token = await getToken();
    return cycleService.getVolumeAnalysis(token, userId);
  };

  const analysisVolumeQuery = useQuery("volumeAnalysis", fetchVolumeAnalysis);
  const analysisRestQuery = useQuery("restAnalysis", fetchRestAnalysis);

  return (
    <>
      <Table>
        <Table.Head>
          <Table.HeadCell>Muscle Group</Table.HeadCell>
          <Table.HeadCell>Total Sets</Table.HeadCell>
          <Table.HeadCell>Grade</Table.HeadCell>
          <Table.HeadCell>Enough Rest</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {analysisVolumeQuery.data?.map((movement, index) => (
            <Table.Row key={index}>
              <Table.Cell>{movement.name}</Table.Cell>
              <Table.Cell>{movement.total_sets}</Table.Cell>
              <Table.Cell>
                {movement.tag === "low" ? (
                  <ChevronDown className="text-red-500" />
                ) : movement.tag === "high" ? (
                  <ChevronUp className="text-blue-500" />
                ) : (
                  <Check className="text-green-500" />
                )}
              </Table.Cell>
              <Table.Cell>
                {analysisRestQuery.data?.[index].enough_rest ? (
                  <Check className="text-green-500" />
                ) : (
                  <X className="text-red-500" />
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}
