import { getClientAtom, getAddressAtom } from "../state/globalState";
import { useRecoilValue } from "recoil";
import { ContractInfo } from "../config/chainInfo";
import { useCallback, useState } from "react";
import { ProjectType } from "@/components/common/ProjectCard";
import _ from "lodash";

export const useActionTx = (projectList: ProjectType[]) => {
  const cwClient = useRecoilValue(getClientAtom);
  const userAddress = useRecoilValue(getAddressAtom);
  const [actionResults, setActionResults] = useState<string[]>(
    Array(projectList.length + 1).fill("")
  );

  const executeAction = useCallback(
    async (walletAddress: string, projectId: number, input: string) => {
      if (!cwClient) return null;
      const copyClient = _.cloneDeep(cwClient);

      console.log(walletAddress, projectId, input);
      try {
        const result = await copyClient.execute(
          userAddress,
          ContractInfo.contractAddr,
          {
            ResultRequestMsg: {
              user: walletAddress,
              id: projectId,
              input: input,
            },
          },
          "auto"
        );

        if (result) {
          // const newActionResults = [...actionResults];
          // newActionResults[projectId] =
          //   "Project Gateway is a groundbreaking solution designed to bridge the gap between Web 2.0 and Web 3.0, built on the Archway platform.";
          // setActionResults(newActionResults);

          let intervalId: NodeJS.Timeout;
          const fetchData = async () => {
            try {
              const response = await fetch(`http://localhost:3327/api/${projectId}`);
              const data = await response.json();
              const parsed = JSON.parse(data.data);

              // Check if the fetch was successful
              if (parsed && parsed.result) {
                const newActionResults = [...actionResults];
                newActionResults[projectId] = parsed.result;
                setActionResults(newActionResults);

                clearInterval(intervalId);
              } else {
                console.error("Not yet", projectId);
              }
            } catch (error) {
              console.error("Fetch failed", projectId, error);
            }
          };
          fetchData();
          intervalId = setInterval(fetchData, 10000);
        } else {
          console.error("Error Tx");
        }

        return result;
      } catch (error) {
        console.error(error);

        return null;
      }
    },
    [cwClient, userAddress, actionResults]
  );

  return { executeAction, actionResults };
};
