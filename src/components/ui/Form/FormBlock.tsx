// @ts-ignore
import styled from "styled-components/native";

type FormBlockProps = {
  inline?: boolean;
};
export const FormBlock = styled.View<FormBlockProps>`
  display: flex;
  flex-direction: ${(props: FormBlockProps) => (props?.inline ? "row" : "column")};
  align-items: ${(props: FormBlockProps) => (props?.inline ? "top" : "left")};
  margin-bottom: 4px;
`;
FormBlock.displayName = FormBlock;
