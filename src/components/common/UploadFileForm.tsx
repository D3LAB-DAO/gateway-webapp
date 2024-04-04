import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadFileTx } from "@/core/hooks/useUploadFileTx";
import tw from "tailwind-styled-components";
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import Button from "./Button";
import { z } from "zod";

export interface FormData {
  githubLink: string;
  walletAddress: string;
  description: string;
}

type UploadFileFormProps = {
  user?: any;
};

const schema = z.object({
  githubLink: z.string().url().nonempty(),
  walletAddress: z.string().nonempty(),
  description: z.string().nonempty(),
});

const UploadFileForm = ({ user = {} }: UploadFileFormProps) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: user,
    resolver: zodResolver(schema),
  });

  const [input, setInput] = useState<FormData | null>(null);
  const { executeUpload } = useUploadFileTx();

  const handleSave = async (formValues: FormData) => {
    setInput(formValues);

    await executeUpload(
      formValues.description,
      formValues.walletAddress,
      formValues.githubLink
    );

    setInput(null);
  };

  const errorState =
    errors.githubLink || errors.walletAddress || errors.description;

  const placeholderValue = "https://raw.githubusercontent.com/D3LAB-DAO/gateway-backend/main/examples/chat.js";
  useEffect(() => {
    setValue("githubLink", placeholderValue);
  }, [setValue]);

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <div className="text-left">
        <InputContainer>
          <InputHeader>🤖 Title</InputHeader>
          <InputBox>
            <Input
              placeholder={"Chat GPT-4 Bot"}
              disabled={true}
            />
          </InputBox>
        </InputContainer>

        <InputContainer>
          <InputHeader>📝 Description</InputHeader>
          <InputBox>
            <Input
              placeholder="Write your Description here"
              // disabled={true}
              {...register("description", {
                required: true,
                minLength: {
                  value: 6,
                  message: "Description must be at least 6 characters",
                },
              })}
            />
          </InputBox>
          {errors.description && (
            <ErrorMessage>
              <span className="font-semibold">Oh, snap!</span> Error Message
            </ErrorMessage>
          )}
        </InputContainer>
        <InputContainer>
          <InputHeader>🚀 Wallet Address</InputHeader>
          <InputBox>
            <Input
              placeholder="Write your Wallet Address here"
              // disabled={true}
              {...register("walletAddress", {
                required: true,
                pattern: {
                  value: /^0x[a-fA-F0-9]{40}$/,
                  message: "Wallet Address is invalid",
                },
              })}
            />
          </InputBox>
          {errors.walletAddress && (
            <ErrorMessage>
              <span className="font-semibold">Oh, snap!</span> Error Message
            </ErrorMessage>
          )}
        </InputContainer>
        <InputContainer>
          <InputHeader>😺 Github Link</InputHeader>
          <InputBox>
            <Input
              placeholder={placeholderValue}
              disabled={true}
              {...register("githubLink", {
                required: true,
                pattern: {
                  value: /^https:\/\/raw.githubusercontent.com\/.+\/.+\/?$/,
                  message: "Github Link is invalid",
                },
              })}
            />
          </InputBox>
          {errors.githubLink && (
            <ErrorMessage>
              <span className="font-semibold">Oh, snap!</span> Please write{" "}
              <b>https://raw.githubusercontent.com/~</b>
            </ErrorMessage>
          )}
        </InputContainer>
        <Button
          isLoading={!!input}
          hasValue={!errorState}
          buttonText="UPLOAD"
        />
      </div>
    </form>
  );
};

export default UploadFileForm;

const InputContainer = tw.div`
  border-b border-gray-100 mb-3
`;
const InputHeader = tw.h2`
  text-md font-semibold leading-7 text-gray-800
`;
const InputBox = tw.div`
  my-2 flex rounded-[5px] shadow-md sm:max-w-md focus:outline-none
`;
const Input = tw.input`
rounded-[5px] ring-1 ring-inset ring-gray-200 flex-auto border-0 py-1.5 pl-2 text-gray-150 placeholder:text-gray-200 focus:ring-0 sm:text-sm sm:leading-6
`;
const ErrorMessage = tw.p`
  text-red-600
  text-sm
  mb-2
`;
