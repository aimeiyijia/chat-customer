import React, { forwardRef, useImperativeHandle, useMemo } from "react"
import { useDropzone } from "react-dropzone"
import base64 from "base-64"
import { generateUUID, getFileType } from "@/utils"
import { httpUploadFile } from "@/api"

export declare type UploadFile = {
  filename: string
  ftpPath: string
  name: string
  type: string
}
export declare type DropzoneProps = {
  onFileUploadSuccess: (params: UploadFile) => void
}

export declare type DropzoneRef = {
  open: () => void
}

const Dropzone = forwardRef(
  (
    props: DropzoneProps,
    ref: React.ForwardedRef<DropzoneRef>
  ): React.ReactElement => {
    const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
      accept: {
        "image/*": [".jpeg", ".png"],
      },
      noClick: true,
      noKeyboard: true,
    })

    // const files = acceptedFiles.map((file: File) => uploadFilePromise(file))
    for (const file of acceptedFiles) {
      console.log(file, "上传的文件")
      uploadFilePromise(file)
        .then((res) => {
          console.log(res, "上传")
          if (res) {
            props.onFileUploadSuccess(res)
          } else {
            console.log("上传失败")
          }
        })
        .catch((err) => {
          console.log("上传失败", err)
        })
    }

    async function uploadFilePromise(singleFile: File) {
      const formData = new FormData()
      var params = {
        appID: "admin",
        uploadID: "",
        ftpDirPath: "/chat/" + generateUUID(),
      }
      formData.append("data", base64.encode(JSON.stringify(params)))
      formData.append("files", singleFile)
      const res = await httpUploadFile(formData)
      const resData = res.data
      if (resData.code === "0") {
        const file = {
          ...resData.files[0],
          ...getFileType({ fileName: resData.files[0].filename }),
        }
        return file
      }
    }

    useImperativeHandle(ref, () => ({
      open,
    }))

    return (
      <div className="container" style={{ display: "none" }}>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
        </div>
      </div>
    )
  }
)
export default Dropzone
