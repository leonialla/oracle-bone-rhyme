/**
 * Returns whether the current component is running in the background
 *
 * for handling problems caused by the keepalive function
 */
export function useDeactivated() {
  const deactivated = ref(false)
  onActivated(() => deactivated.value = false)
  onDeactivated(() => deactivated.value = true)

  return deactivated
}
