import { useBreakpointValue } from "@chakra-ui/react";

import ThemeProvider from "../contexts/global/ThemeProvider";

export const DevicesTypes = Object.freeze({
  undetermined: 'undetermined',
  unsupported: 'unsupported',
  mobile: 'mobile',
  tablet: 'tablet',
  desktop: 'desktop'
});

/**
 * Hook para obter informações sobre o dispositivo do usuário.
 * 
 * É necessário que o caller esteja em um {@link ThemeProvider}
 */
function useDeviceInfo() {
  const deviceType = useBreakpointValue({
    base: DevicesTypes.undetermined,
    xs: DevicesTypes.unsupported,
    sm: DevicesTypes.mobile,
    md: DevicesTypes.tablet,
    lg: DevicesTypes.desktop,
  }, {
    ssr: false,
    fallback: 'base',
  });

  return {
    deviceType,
    isDeviceDetermined: deviceType !== DevicesTypes.undetermined,
    isDeviceSupported: deviceType !== DevicesTypes.unsupported,
    isDeviceThisType: (...types) => {
      for(let i = 0; i < types.length; ++i)
      {
        const type = types[i];

        if (type === deviceType)
        {
          return true;
        }
      }

      return false;
    }  
  };
}

export default useDeviceInfo;