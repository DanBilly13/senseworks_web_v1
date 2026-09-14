'use client'
import { DownOutlined, FilePdfOutlined, SettingOutlined } from '@ant-design/icons'
import { Menu, MenuItem } from '@/components/ui/Menu'

// Constructing antd icons needs a client boundary (D16) — `page.tsx` is a
// server component, so this small island exists just to demo Menu/MenuItem
// with real leading/trailing icons on the /blocks showcase.
export function MenuShowcase() {
  return (
    <Menu className="w-72">
      <MenuItem leadingIcon={<FilePdfOutlined className="text-body" />}>Export as PDF</MenuItem>
      <MenuItem leadingIcon={<SettingOutlined className="text-body" />} trailingIcon={<DownOutlined className="text-caption" />}>
        Settings
      </MenuItem>
      <MenuItem>No icon</MenuItem>
    </Menu>
  )
}
