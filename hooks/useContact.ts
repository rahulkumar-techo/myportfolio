/**
 * Contact hook
 * Sends contact form message
 */

import api from "@/lib/axios"

export function useContact() {

  const sendMessage = async (payload: any) => {
    return api.post("/contact", payload)
  }

  return { sendMessage }
}