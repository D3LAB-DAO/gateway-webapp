import { sliceAddress } from "@/core/utils/numberFormatter";
import { useProjectQuery } from "@/core/hooks/useProjectQuery";
import { getProjectIdAtom } from "@/core/state/globalState";
import tw from "tailwind-styled-components";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import CopyIcon from "./CopyIcon";
import Image from "next/image";
import Action from "./Action";

export type ProjectType = {
  uniqueId: number;
  description: string;
  address: string;
  githubLink: string;
};

const projectList: ProjectType[] = [
  // TODO: from DB
  // {
  //   uniqueId: 1,
  //   description:
  //     "Character AI Bot is an innovative generative AI-driven solution that brings fictional characters to life.",
  //   address: "archway1dqqfypr9a98czeh23a64eh6a0y7cqhycrzsm6a",
  //   githubLink:
  //     "https://raw.githubusercontent.com/D3LAB-DAO/gateway-backend/main/examples/character_ai_bot.js",
  // },
  // {
  //   uniqueId: 2,
  //   description:
  //     "Auto Drawing is a cutting-edge generative AI solution that turns your textual descriptions into captivating visual content.",
  //   address: "archway1cf6fpd3y2e3mv0m22zyuqm2tcqc3g498z0jw6u",
  //   githubLink:
  //     "https://raw.githubusercontent.com/D3LAB-DAO/gateway-backend/main/examples/auto_drawing.js",
  // },
  // {
  //   uniqueId: 3,
  //   description:
  //     "Adrenaline-pumping virtual reality gun shooting game that transports you to a thrilling world of action and adventure.",
  //   address: "archway1zk645ch525zrdgwfzmrq57x4urgmqk65n65v6q",
  //   githubLink:
  //     "https://raw.githubusercontent.com/D3LAB-DAO/gateway-backend/main/examples/vr_game.js",
  // },
];

function removeDuplicateArray(arr: ProjectType[], key: string) {
  return arr.filter(
    (item: any, index, self) =>
      index === self.findIndex((t: any) => t[key] === item[key])
  );
}

const ProjectCard = () => {
  const projectId = useRecoilValue(getProjectIdAtom);

  const { queryProject, newProjectInfo } = useProjectQuery();

  useEffect(() => {
    queryProject(projectId);
  }, [queryProject, projectId]);

  if (newProjectInfo) projectList.push(newProjectInfo);

  const filterdProjectList = removeDuplicateArray(projectList, "uniqueId");

  const projectNameMapping = [
    "Character AI Bot",
    "Auto Drawing",
    "VR Gun Shooting Game",
  ];

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {filterdProjectList.map((item) => (
        <li
          key={`${item.uniqueId}/${item.address}}`}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-2xl bg-white text-center shadow"
        >
          <div className="flex flex-1 flex-col p-4 justify-between">
            <Image
              className="mx-auto flex-shrink-0 rounded-full"
              src={`/image_${item.uniqueId > 3 ? 4 : item.uniqueId}.png`}
              width={500}
              height={500}
              alt="projects"
            />
            <InputHeader>
              #{item.uniqueId}.{" "}
              {item.uniqueId > 3
                ? "Chat GPT-4 Bot"
                : projectNameMapping[item.uniqueId - 1]}
            </InputHeader>
            <p className="text-sm text-gray-500">{item.description}</p>

            <div className="rounded-2xl bg-gray-900 text-center shadow px-6 mt-3">
              <InputHeader className="text-left text-white">
                🚀 Wallet Address
                <p className="text-xs font-normal">
                  {sliceAddress(item.address, 8)}{" "}
                  <CopyIcon text={item.address} />
                </p>
              </InputHeader>
              <InputHeader className="text-left text-white mb-6 mt-4">
                😺 Github Link
                <p className="text-xs font-normal">
                  {sliceAddress(item.githubLink, 18)}{" "}
                  <CopyIcon text={item.githubLink} />
                </p>
              </InputHeader>
            </div>
            <Action
              projectId={item.uniqueId}
              projectList={filterdProjectList}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProjectCard;

const InputHeader = tw.div`
  text-md font-semibold leading-7 text-gray-800 mt-3
`;
