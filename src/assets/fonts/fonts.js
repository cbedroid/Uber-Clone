import { createGlobalStyle } from "styled-components";
import UberMoveMedium from "./UberMove-Medium.woff2";
import UberMoveRegular from "./UberMove-Regular.woff2";
import UberTextMedium from "./UberMoveText-Medium.woff2";
import UberTextRegular from "./UberMoveText-Regular.woff2";

export default createGlobalStyle`
    @font-face {
      font-family: 'Font Name';
      src: local('Font Name'), local('FontName'),
      url(${UberMoveRegular}) format('woff2'),
      url(${UberMoveMedium}) format('woff2'),
      url(${UberTextMedium}) format('woff2'),
      url(${UberTextRegular}) format('woff2'),
      font-weight: 300;
      font-style: normal;
     }
  `;
