import fetch from "@/http"
// 文件上传
export async function httpUploadFile(params: any) {
  return await fetch.post("/upload", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
}
