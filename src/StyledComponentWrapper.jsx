// src/StyledComponentWrapper.jsx
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';

export default function StyledComponentWrapper({ children }) {
  return (
    <StyleSheetManager shouldForwardProp={isPropValid}>
      {children}
    </StyleSheetManager>
  );
}
