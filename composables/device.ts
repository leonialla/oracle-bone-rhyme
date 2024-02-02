import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export const isMobileDevice = useBreakpoints(breakpointsTailwind).smallerOrEqual('lg')
