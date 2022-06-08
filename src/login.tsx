import React, { useState } from "react"
import { Button, Modal } from "@chatui/core"

export default function () {
  const [open, setOpen] = useState(false)

  function handleOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  function handleConfirm() {
    alert("Confirm")
    setOpen(false)
  }

  return (
    <div>
      <Button onClick={handleOpen}>Open</Button>
      <Modal
        active={open}
        title="My Title"
        showClose={false}
        onClose={handleClose}
        actions={[
          {
            label: "Confirm",
            color: "primary",
            onClick: handleConfirm,
          },
          {
            label: "Back",
            onClick: handleClose,
          },
        ]}
      >
        <p style={{ paddingLeft: "15px" }} />
      </Modal>
    </div>
  )
}
