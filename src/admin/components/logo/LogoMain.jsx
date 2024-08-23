// material-ui
import { useTheme } from '@mui/material/styles';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={logo} alt="Mantis" width="100" />
     *
     */
    <>
      <svg
        width="205"
        height="46"
        viewBox="0 0 205 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <rect width="204.495" height="46" fill="url(#pattern0_7522_19644)" />
        <defs>
          <pattern id="pattern0_7522_19644" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlink:href="#image0_7522_19644" transform="scale(0.00222717 0.00990099)" />
          </pattern>
          <image
            id="image0_7522_19644"
            width="449"
            height="101"
            xlink:href="data:image/png;base64,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"
          />
        </defs>
      </svg>
    </>
  );
};

export default Logo;
