import { type CSSProperties, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, ImagePlus, Loader2, Pencil, Save, Trash2, Upload } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { CmsLayout } from '@/components/layout/CmsLayout'
import {
  adminCreateSapatamuAsset,
  adminSapatamuTemplateDemoPreview,
  adminSapatamuTemplateEditor,
  adminSaveSapatamuTemplateDemoPreview,
  adminSaveSapatamuTemplateEditorLayout,
  adminUpdateSapatamuAsset,
  adminUploadSapatamuDemoPreviewAsset,
  resolveApiAssetUrl,
} from '@/lib/api'
import { CMS_SIDEBAR_LINKS } from '@/lib/constants'
import { PreviewPage } from '@/pages/cms/sapatamu/CmsSapatamuEditor'
import { GALLERY_LAYOUT_VARIANTS, getGalleryFrameLayout, getGalleryLayoutVariant, getGallerySlotFrame, getGalleryVariantFrameSettings } from '@/pages/cms/sapatamu/editor/gallery-layouts'
import { stripEditorHtml } from '@/pages/cms/sapatamu/editor/editor-utils'
import type {
  AdminEditorLayoutTemplate,
  AdminSapatamuDemoPreviewPayload,
  AdminSapatamuTemplateEditorPayload,
  AdminTemplateAsset,
} from '@/types/admin'
import type {
  SapatamuEditorDocumentV3,
  SapatamuEditorPage,
} from '@/types/sapatamu'

type PanelMode = 'layout' | 'background' | 'assets' | 'demo'

type DemoPreviewForm = AdminSapatamuDemoPreviewPayload['settings']

type UploadedDemoAsset = {
  url: string
  fileName: string
  size: number
  mime: string
}

const ANIMATION_OPTIONS = [
  { value: 0, label: 'None' },
  { value: 5, label: 'Rise Up' },
  { value: 8, label: 'Rise Down' },
  { value: 6, label: 'Rise Left' },
  { value: 7, label: 'Rise Right' },
  { value: 9, label: 'Zoom In' },
  { value: 10, label: 'Zoom Out' },
  { value: 14, label: 'Pulse' },
  { value: 16, label: 'Pop' },
  { value: 17, label: 'Wiggle' },
] as const

const ORNAMENT_HIT_STYLES: Record<string, CSSProperties> = {
  top_left: { left: '4%', top: '2%', width: '34%', height: '22%' },
  top_right: { right: '4%', top: '2%', width: '34%', height: '22%' },
  middle_left: { left: '4%', top: '38%', width: '26%', height: '24%' },
  middle_right: { right: '4%', top: '38%', width: '26%', height: '24%' },
  bottom_left: { left: '4%', bottom: '2%', width: '34%', height: '24%' },
  bottom_right: { right: '4%', bottom: '2%', width: '34%', height: '24%' },
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function setPathValue(source: Record<string, unknown>, path: string, value: unknown) {
  const next = deepClone(source)
  const parts = path.split('.').filter(Boolean)
  let cursor: Record<string, unknown> = next

  parts.slice(0, -1).forEach((part) => {
    const current = cursor[part]
    if (!current || typeof current !== 'object' || Array.isArray(current)) {
      cursor[part] = {}
    }
    cursor = cursor[part] as Record<string, unknown>
  })

  cursor[parts[parts.length - 1]] = value
  return next
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function buildEmptyDemoPreviewForm(): DemoPreviewForm {
  return {
    enabled: true,
    profiles: [
      { id: 'profile-1', label: 'Profile 1', fullName: 'Raka Pratama', nickName: 'Raka', description: 'Putra pertama keluarga Pratama', photoUrl: '' },
      { id: 'profile-2', label: 'Profile 2', fullName: 'Nadia Kirana', nickName: 'Nadia', description: 'Putri kedua keluarga Kirana', photoUrl: '' },
    ],
    events: [
      { id: 'event-1', name: 'Akad Nikah', date: '2026-08-08', timeStart: '08:00', timeEnd: '10:00', timeZone: 'WIB', address: 'Ballroom Nusantara', mapLocation: 'https://maps.google.com', enabled: true },
      { id: 'event-2', name: 'Resepsi', date: '2026-08-08', timeStart: '11:00', timeEnd: '14:00', timeZone: 'WIB', address: 'Ballroom Nusantara', mapLocation: 'https://maps.google.com', enabled: true },
    ],
    galleryImageUrls: [],
    musicUrl: '',
    giftAccounts: [
      { bankName: 'BCA', accountNumber: '1234567890', accountHolder: 'Raka Pratama' },
    ],
    giftAddress: 'Jl. Melati No. 8, Jakarta Selatan',
  }
}

function getEditableElement(page: SapatamuEditorPage | null, elementKey: string | null) {
  if (!page || !elementKey) return null
  const value = page.data[elementKey]
  return isPlainRecord(value) ? value : null
}

function buildAssetMetadata(asset: AdminTemplateAsset, overrides: Record<string, unknown>) {
  return {
    ...(asset.metadata ?? {}),
    ...overrides,
    animation: {
      ...((asset.metadata?.animation as Record<string, unknown> | undefined) ?? {}),
      ...((overrides.animation as Record<string, unknown> | undefined) ?? {}),
    },
  }
}

function getAssetSlot(asset: AdminTemplateAsset) {
  return String(asset.metadata?.slot ?? '').trim()
}

function AdminEditorShell(props: { title: string; subtitle?: string; children: React.ReactNode; workspaceMode?: boolean }) {
  return (
    <CmsLayout
      sidebarLinks={CMS_SIDEBAR_LINKS.admin}
      title={props.title}
      subtitle={props.subtitle}
      defaultCollapsed={props.workspaceMode}
      hideHeader={props.workspaceMode}
      mainClassName={props.workspaceMode ? 'h-[100dvh] overflow-hidden p-0 lg:p-0' : undefined}
      contentClassName={props.workspaceMode ? 'h-full overflow-hidden' : undefined}
    >
      {props.children}
    </CmsLayout>
  )
}

function DesignNumberInput(props: { label: string; value: unknown; onChange: (value: number) => void; step?: number }) {
  return (
    <div>
      <Label>{props.label}</Label>
      <Input
        className="mt-2"
        type="number"
        step={props.step ?? 1}
        value={Number(props.value ?? 0)}
        onChange={(event) => props.onChange(Number(event.target.value || 0))}
      />
    </div>
  )
}

function DesignSliderInput(props: {
  label: string
  value: unknown
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  suffix?: string
}) {
  const value = Number(props.value ?? 0)
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{props.label}</Label>
        <span className="text-sm font-semibold text-slate-900">{value}{props.suffix ? <span className="ml-1 text-xs text-slate-500">{props.suffix}</span> : null}</span>
      </div>
      <input
        type="range"
        min={props.min ?? 0}
        max={props.max ?? 100}
        step={props.step ?? 1}
        value={value}
        className="sapatamu-editor-range w-full"
        onChange={(event) => props.onChange(Number(event.target.value))}
      />
    </div>
  )
}

function DesignTextInput(props: { label: string; value: unknown; onChange: (value: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <Label>{props.label}</Label>
      <Input
        className="mt-2"
        type={props.type ?? 'text'}
        value={String(props.value ?? '')}
        placeholder={props.placeholder}
        onChange={(event) => props.onChange(event.target.value)}
      />
    </div>
  )
}

function DesignTextareaInput(props: { label: string; value: unknown; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div>
      <Label>{props.label}</Label>
      <Textarea
        className="mt-2 min-h-24 rounded-2xl border-border bg-background"
        value={String(props.value ?? '')}
        placeholder={props.placeholder}
        onChange={(event) => props.onChange(event.target.value)}
      />
    </div>
  )
}

function getDefaultContentFields(type: string, element: Record<string, unknown>) {
  const fields: Array<{ key: string; label: string; multiline?: boolean; placeholder?: string }> = []

  if (type === 'text') {
    fields.push({ key: 'content', label: 'Default Text', multiline: true, placeholder: 'Tulis teks default. Token seperti {{nick-name-1}} tetap boleh dipakai.' })
  }

  if (type === 'button' || type === 'url') {
    fields.push(
      { key: 'content', label: 'Button Text', placeholder: 'Contoh: Buka Undangan' },
      { key: 'link', label: 'Default Link', placeholder: '#open, rsvp:open, gift:angpao, atau URL' },
    )
  }

  if (['rsvp', 'gift', 'story', 'sponsor', 'credit'].includes(type)) {
    fields.push({ key: 'title', label: 'Default Title', placeholder: 'Judul section' })
    if ('description' in element) {
      fields.push({ key: 'description', label: 'Default Description', multiline: true, placeholder: 'Deskripsi section' })
    }
    if ('buttonLabel' in element) {
      fields.push({ key: 'buttonLabel', label: 'Button Text', placeholder: 'Label tombol' })
    }
  }

  if (type === 'gallery' || type === 'video') {
    fields.push({ key: 'title', label: 'Default Title', placeholder: 'Judul section' })
  }

  if (type === 'video') {
    fields.push({ key: 'url', label: 'Default Video URL', placeholder: 'YouTube atau file video' })
  }

  if (type === 'map') {
    fields.push(
      { key: 'content', label: 'Map Title', placeholder: 'Contoh: Lokasi Acara' },
      { key: 'url', label: 'Default Maps URL', placeholder: 'Link Google Maps' },
    )
  }

  if (type === 'timer') {
    fields.push({ key: 'content', label: 'Default Target Date', placeholder: 'YYYY-MM-DDTHH:mm:ss' })
  }

  return fields.filter((field) => field.key in element)
}

function DefaultContentInspector(props: {
  elementKey: string
  element: Record<string, unknown>
  type: string
  onChange: (path: string, value: unknown) => void
}) {
  const fields = getDefaultContentFields(props.type, props.element)
  const editableItems = Array.isArray(props.element.items)
    ? props.element.items.filter((item): item is Record<string, unknown> => isPlainRecord(item))
    : []
  const canEditItems = ['story', 'sponsor', 'credit'].includes(props.type) && editableItems.length > 0

  if (!fields.length && !canEditItems) return null

  const updateItem = (index: number, key: string, value: string) => {
    const nextItems = [...(props.element.items as unknown[])]
    const current = isPlainRecord(nextItems[index]) ? nextItems[index] as Record<string, unknown> : {}
    nextItems[index] = { ...current, [key]: value }
    props.onChange(`${props.elementKey}.items`, nextItems)
  }

  return (
    <div className="space-y-4 rounded-3xl border border-emerald-100 bg-emerald-50/55 p-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Default Content</p>
        <p className="mt-1 text-xs leading-5 text-emerald-900/75">
          Ini adalah copy bawaan template. Token seperti {'{{nick-name-1}}'} tetap disimpan mentah dan akan diisi dari data user.
        </p>
      </div>
      {fields.map((field) => (
        field.multiline ? (
          <DesignTextareaInput
            key={field.key}
            label={field.label}
            value={stripEditorHtml(String(props.element[field.key] ?? ''))}
            placeholder={field.placeholder}
            onChange={(value) => props.onChange(`${props.elementKey}.${field.key}`, value)}
          />
        ) : (
          <DesignTextInput
            key={field.key}
            label={field.label}
            value={field.key === 'content' ? stripEditorHtml(String(props.element[field.key] ?? '')) : props.element[field.key]}
            placeholder={field.placeholder}
            onChange={(value) => props.onChange(`${props.elementKey}.${field.key}`, value)}
          />
        )
      ))}
      {canEditItems ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Default Items
          </p>
          {editableItems.map((item, index) => (
            <div key={index} className="space-y-3 rounded-2xl border border-emerald-100 bg-white/75 p-3">
              <p className="text-xs font-semibold text-slate-500">Item {index + 1}</p>
              {'title' in item ? (
                <DesignTextInput label="Title" value={item.title} onChange={(value) => updateItem(index, 'title', value)} />
              ) : null}
              {'date' in item ? (
                <DesignTextInput label="Date" value={item.date} onChange={(value) => updateItem(index, 'date', value)} />
              ) : null}
              {'description' in item ? (
                <DesignTextareaInput label="Description" value={item.description} onChange={(value) => updateItem(index, 'description', value)} />
              ) : null}
              {'name' in item ? (
                <DesignTextInput label="Name" value={item.name} onChange={(value) => updateItem(index, 'name', value)} />
              ) : null}
              {'phone' in item ? (
                <DesignTextInput label="Phone" value={item.phone} onChange={(value) => updateItem(index, 'phone', value)} />
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function GalleryFrameInspector(props: {
  elementKey: string
  element: Record<string, unknown>
  onChange: (path: string, value: unknown) => void
}) {
  const variant = getGalleryLayoutVariant(String(props.element.variant ?? '')).id
  const frameSettingsByVariant = isPlainRecord(props.element.frameSettingsByVariant) ? props.element.frameSettingsByVariant : {}
  const frameSettings = getGalleryVariantFrameSettings(variant, frameSettingsByVariant)
  const frameLayout = getGalleryFrameLayout(variant, frameSettings)
  const updateFrameSettings = (patch: Record<string, unknown>) => {
    props.onChange(`${props.elementKey}.frameSettingsByVariant.${variant}`, { ...frameSettings, ...patch })
  }
  const updateSlot = (index: number, patch: Record<string, unknown>) => {
    const slots = Array.from({ length: getGalleryLayoutVariant(variant).slotCount }, (_, slotIndex) => {
      const currentSlots = Array.isArray(frameSettings.slots) ? frameSettings.slots : []
      return isPlainRecord(currentSlots[slotIndex]) ? currentSlots[slotIndex] : {}
    })
    slots[index] = { ...slots[index], ...patch }
    updateFrameSettings({ slots })
  }

  return (
    <div className="space-y-4 rounded-3xl border border-sky-100 bg-sky-50/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Frame Gallery</p>
          <p className="mt-1 text-xs leading-5 text-sky-900/75">
            Setting ini menjadi default per tema/template. User hanya menggeser foto di dalam frame.
          </p>
        </div>
        <Button type="button" size="sm" variant="outline" className="rounded-xl bg-white" onClick={() => props.onChange(`${props.elementKey}.frameSettingsByVariant.${variant}`, {})}>
          Reset
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <DesignNumberInput label="Kolom Grid" value={frameLayout.columns} onChange={(value) => updateFrameSettings({ columns: value })} />
        <DesignNumberInput label="Tinggi Row" value={frameLayout.rowHeight} onChange={(value) => updateFrameSettings({ rowHeight: value })} />
        <DesignNumberInput label="Gap" value={frameLayout.gap} onChange={(value) => updateFrameSettings({ gap: value })} />
      </div>
      <div className="space-y-3">
        {Array.from({ length: getGalleryLayoutVariant(variant).slotCount }, (_, index) => {
          const frame = getGallerySlotFrame(variant, index, frameSettings)
          return (
            <div key={index} className="rounded-2xl bg-white p-3 shadow-sm">
              <p className="mb-3 text-xs font-semibold text-slate-600">Frame Foto {index + 1}</p>
              <div className="grid grid-cols-2 gap-3">
                <DesignNumberInput label="Mulai Kolom" value={frame.colStart} onChange={(value) => updateSlot(index, { colStart: value })} />
                <DesignNumberInput label="Mulai Baris" value={frame.rowStart} onChange={(value) => updateSlot(index, { rowStart: value })} />
                <DesignNumberInput label="Lebar" value={frame.colSpan} onChange={(value) => updateSlot(index, { colSpan: value })} />
                <DesignNumberInput label="Tinggi" value={frame.rowSpan} onChange={(value) => updateSlot(index, { rowSpan: value })} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ElementDesignInspector(props: {
  elementKey: string
  element: Record<string, unknown>
  fonts: AdminSapatamuTemplateEditorPayload['catalog']['fonts']
  onChange: (path: string, value: unknown) => void
}) {
  const type = String(props.element.type ?? 'element')
  const padding = isPlainRecord(props.element.padding) ? props.element.padding : null
  const animation = isPlainRecord(props.element.animation) ? props.element.animation : null
  const box = isPlainRecord(props.element.box) ? props.element.box : null
  const frame = isPlainRecord(props.element.frame) ? props.element.frame : null
  const canEditTypography = ['text', 'button', 'url'].includes(type)

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3 text-xs leading-5 text-amber-900">
        <p className="font-semibold">{props.elementKey} · {type}</p>
        <p className="mt-1">Admin mengatur default konten dan visual template: teks bawaan, posisi, ukuran, warna, frame, dan animasi.</p>
      </div>

      <DefaultContentInspector
        elementKey={props.elementKey}
        element={props.element}
        type={type}
        onChange={props.onChange}
      />

      <label className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm">
        Tampilkan elemen
        <Switch checked={props.element.disabled !== true} onCheckedChange={(checked) => props.onChange(`${props.elementKey}.disabled`, !checked)} />
      </label>

      {padding ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Posisi / Padding</p>
          <div className="space-y-4">
            <DesignSliderInput label="Posisi X" value={padding.x} min={-500} max={500} suffix="px" onChange={(value) => props.onChange(`${props.elementKey}.padding.x`, value)} />
            <DesignSliderInput label="Posisi Y" value={padding.y} min={-500} max={500} suffix="px" onChange={(value) => props.onChange(`${props.elementKey}.padding.y`, value)} />
            <DesignSliderInput label="Spasi Atas" value={padding.top} min={0} max={500} suffix="px" onChange={(value) => props.onChange(`${props.elementKey}.padding.top`, value)} />
            <DesignSliderInput label="Spasi Bawah" value={padding.bottom} min={0} max={500} suffix="px" onChange={(value) => props.onChange(`${props.elementKey}.padding.bottom`, value)} />
            <div className="grid grid-cols-2 gap-3">
              <DesignNumberInput label="Kiri" value={padding.left} onChange={(value) => props.onChange(`${props.elementKey}.padding.left`, value)} />
              <DesignNumberInput label="Kanan" value={padding.right} onChange={(value) => props.onChange(`${props.elementKey}.padding.right`, value)} />
            </div>
          </div>
        </div>
      ) : null}

      {canEditTypography ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Typography</p>
          <div className="grid grid-cols-2 gap-3">
            {'size' in props.element ? <DesignSliderInput label="Font Size" value={props.element.size} min={8} max={90} suffix="px" onChange={(value) => props.onChange(`${props.elementKey}.size`, value)} /> : null}
            {'lineHeight' in props.element ? <DesignNumberInput label="Line Height" value={props.element.lineHeight} onChange={(value) => props.onChange(`${props.elementKey}.lineHeight`, value)} step={0.1} /> : null}
          </div>
          {'font' in props.element ? (
            <div>
              <Label>Font</Label>
              <select className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm" value={String(props.element.font ?? '')} onChange={(event) => props.onChange(`${props.elementKey}.font`, event.target.value)}>
                {props.fonts.map((font) => <option key={font.id} value={font.id}>{font.name}</option>)}
              </select>
            </div>
          ) : null}
          {'align' in props.element ? (
            <div>
              <Label>Align</Label>
              <select className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm" value={String(props.element.align ?? 'center')} onChange={(event) => props.onChange(`${props.elementKey}.align`, event.target.value)}>
                {['left', 'center', 'right'].map((align) => <option key={align}>{align}</option>)}
              </select>
            </div>
          ) : null}
          {'color' in props.element ? <DesignTextInput label="Color" value={props.element.color} onChange={(value) => props.onChange(`${props.elementKey}.color`, value)} /> : null}
        </div>
      ) : null}

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Ukuran & Style</p>
        <div className="grid grid-cols-2 gap-3">
          {'size' in props.element && !canEditTypography ? <DesignSliderInput label="Size" value={props.element.size} min={0} max={500} suffix="px" onChange={(value) => props.onChange(`${props.elementKey}.size`, value)} /> : null}
          {'size1' in props.element ? <DesignNumberInput label="Size 1" value={props.element.size1} onChange={(value) => props.onChange(`${props.elementKey}.size1`, value)} /> : null}
          {'size2' in props.element ? <DesignNumberInput label="Size 2" value={props.element.size2} onChange={(value) => props.onChange(`${props.elementKey}.size2`, value)} /> : null}
          {'columns' in props.element && type !== 'gallery' ? <DesignNumberInput label="Columns" value={props.element.columns} onChange={(value) => props.onChange(`${props.elementKey}.columns`, value)} /> : null}
          {type === 'gallery' ? (
            <div>
              <Label className="text-xs text-muted-foreground">Variasi Gallery</Label>
              <select
                className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
                value={getGalleryLayoutVariant(String(props.element.variant ?? '')).id}
                onChange={(event) => props.onChange(`${props.elementKey}.variant`, event.target.value)}
              >
                {GALLERY_LAYOUT_VARIANTS.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.label} ({variant.slotCount} slot)
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          {'borderSize' in props.element ? <DesignNumberInput label="Border Size" value={props.element.borderSize} onChange={(value) => props.onChange(`${props.elementKey}.borderSize`, value)} /> : null}
          {'borderRadius' in props.element ? <DesignNumberInput label="Border Radius" value={props.element.borderRadius} onChange={(value) => props.onChange(`${props.elementKey}.borderRadius`, value)} /> : null}
        </div>
        {'borderColor' in props.element ? <DesignTextInput label="Border Color" value={props.element.borderColor} onChange={(value) => props.onChange(`${props.elementKey}.borderColor`, value)} /> : null}
        {'backgroundColor' in props.element ? <DesignTextInput label="Background" value={props.element.backgroundColor} onChange={(value) => props.onChange(`${props.elementKey}.backgroundColor`, value)} /> : null}
        {'backgroundColor2' in props.element ? <DesignTextInput label="Background 2" value={props.element.backgroundColor2} onChange={(value) => props.onChange(`${props.elementKey}.backgroundColor2`, value)} /> : null}
        {'gradientAngle' in props.element ? <DesignNumberInput label="Gradient Angle" value={props.element.gradientAngle} onChange={(value) => props.onChange(`${props.elementKey}.gradientAngle`, value)} /> : null}
        {'color1' in props.element ? <DesignTextInput label="Color 1" value={props.element.color1} onChange={(value) => props.onChange(`${props.elementKey}.color1`, value)} /> : null}
        {'color2' in props.element ? <DesignTextInput label="Color 2" value={props.element.color2} onChange={(value) => props.onChange(`${props.elementKey}.color2`, value)} /> : null}
      </div>

      {type === 'gallery' ? (
        <GalleryFrameInspector
          elementKey={props.elementKey}
          element={props.element}
          onChange={props.onChange}
        />
      ) : null}

      {box ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Text Box</p>
          <label className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm">
            Box aktif
            <Switch checked={box.disabled !== true} onCheckedChange={(checked) => props.onChange(`${props.elementKey}.box.disabled`, !checked)} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <DesignNumberInput label="Radius" value={box.borderRadius} onChange={(value) => props.onChange(`${props.elementKey}.box.borderRadius`, value)} />
            <DesignNumberInput label="Angle" value={box.gradientAngle} onChange={(value) => props.onChange(`${props.elementKey}.box.gradientAngle`, value)} />
          </div>
          <DesignTextInput label="Box BG" value={box.backgroundColor} onChange={(value) => props.onChange(`${props.elementKey}.box.backgroundColor`, value)} />
          <DesignTextInput label="Box BG 2" value={box.backgroundColor2} onChange={(value) => props.onChange(`${props.elementKey}.box.backgroundColor2`, value)} />
        </div>
      ) : null}

      {frame ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Frame</p>
          <label className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm">
            Frame aktif
            <Switch checked={frame.disabled !== true} onCheckedChange={(checked) => props.onChange(`${props.elementKey}.frame.disabled`, !checked)} />
          </label>
          <DesignTextInput label="Frame URL" value={frame.content} onChange={(value) => props.onChange(`${props.elementKey}.frame.content`, value)} />
        </div>
      ) : null}

      {animation ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Animation</p>
          <div className="grid grid-cols-2 gap-2">
            {ANIMATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`rounded-2xl border px-3 py-2 text-left text-xs font-semibold transition ${Number(animation.style ?? 0) === option.value ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                onClick={() => props.onChange(`${props.elementKey}.animation.style`, option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <DesignSliderInput label="Duration" value={animation.duration} min={0.5} max={8} step={0.5} suffix="s" onChange={(value) => props.onChange(`${props.elementKey}.animation.duration`, value)} />
        </div>
      ) : null}
    </div>
  )
}

function AssetInspector(props: {
  asset: AdminTemplateAsset | null
  onSave: (asset: AdminTemplateAsset, patch: Record<string, unknown>) => void
}) {
  const [draft, setDraft] = useState({ url: '', slot: '', enabled: true, animationStyle: 'none', animationDuration: '3', opacity: '1' })

  useEffect(() => {
    if (!props.asset) return
    const metadata = props.asset.metadata ?? {}
    const animation = (metadata.animation as Record<string, unknown> | undefined) ?? {}
    setDraft({
      url: props.asset.url,
      slot: String(metadata.slot ?? ''),
      enabled: metadata.enabled !== false && props.asset.is_active,
      animationStyle: String(animation.style ?? metadata.animationStyle ?? 'none'),
      animationDuration: String(animation.duration ?? metadata.animationDuration ?? '3'),
      opacity: String(metadata.opacity ?? '1'),
    })
  }, [props.asset])

  if (!props.asset) {
    return <p className="text-sm text-muted-foreground">Pilih asset background atau ornament untuk diedit.</p>
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold">{props.asset.asset_key}</p>
        <p className="text-xs text-muted-foreground">{props.asset.asset_type}</p>
      </div>
      <div>
        <Label>Asset URL</Label>
        <Textarea className="mt-2 min-h-20 rounded-2xl" value={draft.url} onChange={(event) => setDraft({ ...draft, url: event.target.value })} />
      </div>
      {props.asset.asset_type === 'ornament' ? (
        <>
          <div>
            <Label>Slot</Label>
            <select className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm" value={draft.slot} onChange={(event) => setDraft({ ...draft, slot: event.target.value })}>
              {['top_left', 'top_right', 'middle_left', 'middle_right', 'bottom_left', 'bottom_right'].map((slot) => <option key={slot}>{slot}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Animation</Label>
              <Input className="mt-2" value={draft.animationStyle} onChange={(event) => setDraft({ ...draft, animationStyle: event.target.value })} />
            </div>
            <div>
              <Label>Duration</Label>
              <Input className="mt-2" type="number" value={draft.animationDuration} onChange={(event) => setDraft({ ...draft, animationDuration: event.target.value })} />
            </div>
          </div>
          <div>
            <Label>Opacity</Label>
            <Input className="mt-2" type="number" step="0.1" value={draft.opacity} onChange={(event) => setDraft({ ...draft, opacity: event.target.value })} />
          </div>
        </>
      ) : null}
      <label className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm">
        Aktif
        <Switch checked={draft.enabled} onCheckedChange={(checked) => setDraft({ ...draft, enabled: checked })} />
      </label>
      <Button
        className="w-full rounded-2xl"
        onClick={() =>
          props.onSave(props.asset!, {
            url: draft.url,
            isActive: draft.enabled,
            metadata: buildAssetMetadata(props.asset!, {
              enabled: draft.enabled,
              slot: draft.slot,
              opacity: Number(draft.opacity || 1),
              animation: {
                style: draft.animationStyle,
                duration: Number(draft.animationDuration || 3),
              },
            }),
          })
        }
      >
        <Save className="mr-2 size-4" />
        Simpan Asset
      </Button>
    </div>
  )
}

export function AdminSapatamuTemplateEditorPage() {
  const { templateId = '' } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [payload, setPayload] = useState<AdminSapatamuTemplateEditorPayload | null>(null)
  const [documentValue, setDocumentValue] = useState<SapatamuEditorDocumentV3 | null>(null)
  const [demoPreview, setDemoPreview] = useState<AdminSapatamuDemoPreviewPayload | null>(null)
  const [demoForm, setDemoForm] = useState<DemoPreviewForm | null>(null)
  const [selectedLayoutCode, setSelectedLayoutCode] = useState('')
  const [panelMode, setPanelMode] = useState<PanelMode>('layout')
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null)
  const [isLayoutSettingMode, setIsLayoutSettingMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const selectedElement = searchParams.get('element')
  const selectedPage = useMemo(
    () => documentValue?.editor.pages.find((page) => page.layoutCode === selectedLayoutCode) ?? documentValue?.editor.pages[0] ?? null,
    [documentValue, selectedLayoutCode],
  )
  const selectedElementValue = getEditableElement(selectedPage, selectedElement)
  const selectedAsset = payload?.assets.find((asset) => asset.id === selectedAssetId) ?? null
  const ornamentAssets = useMemo(
    () => (payload?.assets ?? []).filter((asset) => asset.asset_type === 'ornament' && asset.is_active),
    [payload?.assets],
  )
  const fallbackImages = useMemo(
    () => (payload?.assets ?? [])
      .filter((asset) => ['background', 'image', 'ornament', 'preview'].includes(asset.asset_type))
      .map((asset) => asset.url),
    [payload?.assets],
  )
  const stageBackgroundUrl = documentValue?.editor.globalBackground
  const stageBackgroundType = documentValue?.editor.globalBackgroundDetails?.type
  const previewStageStyle: CSSProperties =
    stageBackgroundUrl && stageBackgroundType !== 'video'
      ? {
          backgroundImage: `linear-gradient(90deg, rgba(48, 22, 20, 0.2), rgba(48, 22, 20, 0.08), rgba(48, 22, 20, 0.2)), url(${resolveApiAssetUrl(stageBackgroundUrl)})`,
          backgroundPosition: 'center top',
          backgroundSize: 'cover',
        }
      : {}

  const reload = () => {
    if (!templateId) return
    void adminSapatamuTemplateEditor<AdminSapatamuTemplateEditorPayload>(templateId).then((response) => {
      if (!response.data) return
      setPayload(response.data)
      setDocumentValue(response.data.previewDocument)
      setSelectedLayoutCode((current) => current || response.data!.previewDocument.editor.pages[0]?.layoutCode || '')
      setSelectedAssetId((current) => current || response.data!.assets[0]?.id || null)
    })
    void adminSapatamuTemplateDemoPreview<AdminSapatamuDemoPreviewPayload>(templateId).then((response) => {
      if (!response.data) return
      setDemoPreview(response.data)
      setDemoForm(response.data.settings)
    })
  }

  useEffect(reload, [templateId])

  useEffect(() => {
    if (!payload || demoForm) return
    setDemoForm(buildEmptyDemoPreviewForm())
  }, [demoForm, payload])

  useEffect(() => {
    if (selectedElement) {
      setPanelMode('layout')
      setIsLayoutSettingMode(true)
    }
  }, [selectedElement])

  const updateSelectedPage = (patch: Partial<SapatamuEditorPage>) => {
    if (!selectedPage) return
    setDocumentValue((current) => {
      if (!current) return current
      return {
        ...current,
        editor: {
          ...current.editor,
          pages: current.editor.pages.map((page) =>
            page.uniqueId === selectedPage.uniqueId ? { ...page, ...patch } : page,
          ),
        },
      }
    })
  }

  const exitLayoutSettingMode = () => {
    setIsLayoutSettingMode(false)
    setSearchParams({})
  }

  const updatePageData = (path: string, value: unknown) => {
    if (!selectedPage) return
    setDocumentValue((current) => {
      if (!current) return current
      return {
        ...current,
        editor: {
          ...current.editor,
          pages: current.editor.pages.map((page) =>
            page.uniqueId === selectedPage.uniqueId
              ? { ...page, data: setPathValue(page.data, path, value) as SapatamuEditorPage['data'] }
              : page,
          ),
        },
      }
    })
  }

  const updateGlobalBackground = (url: string) => {
    setDocumentValue((current) => current ? {
      ...current,
      editor: {
        ...current.editor,
        globalBackground: url,
        globalBackgroundDetails: {
          ...current.editor.globalBackgroundDetails,
          type: /\.(mp4|webm|mov)$/i.test(url) ? 'video' : 'image',
        },
      },
    } : current)
  }

  const saveLayout = async (pageToSave: SapatamuEditorPage, exitAfterSave = false) => {
    if (!templateId) return
    setIsSaving(true)
    try {
      const response = await adminSaveSapatamuTemplateEditorLayout<AdminEditorLayoutTemplate>(templateId, pageToSave.layoutCode, {
        family: pageToSave.family,
        title: pageToSave.title,
        defaultDataJson: pageToSave.data,
        sortOrder: pageToSave.uniqueId,
        isActive: pageToSave.isActive,
      })
      if (response.data) {
        if (exitAfterSave) {
          setIsLayoutSettingMode(false)
          setPanelMode('layout')
          setSearchParams({})
        }
        reload()
      }
    } finally {
      setIsSaving(false)
    }
  }

  const saveCurrentLayout = async () => {
    if (!selectedPage) return
    await saveLayout(selectedPage, true)
  }

  const saveAsset = async (asset: AdminTemplateAsset, patch: Record<string, unknown>) => {
    setIsSaving(true)
    try {
      await adminUpdateSapatamuAsset(asset.id, patch)
      reload()
    } finally {
      setIsSaving(false)
    }
  }

  const upsertBackgroundAsset = async () => {
    if (!templateId || !documentValue?.editor.globalBackground) return
    const existing = payload?.assets.find((asset) => asset.asset_type === 'background')
    setIsSaving(true)
    try {
      if (existing) {
        await adminUpdateSapatamuAsset(existing.id, {
          url: documentValue.editor.globalBackground,
          assetType: existing.asset_type,
          assetKey: existing.asset_key,
          isActive: true,
          metadata: existing.metadata ?? {},
        })
      } else {
        await adminCreateSapatamuAsset(templateId, {
          assetType: 'background',
          assetKey: 'background.global',
          url: documentValue.editor.globalBackground,
          sortOrder: 0,
          isActive: true,
          metadata: { source: 'admin-editor' },
        })
      }
      reload()
    } finally {
      setIsSaving(false)
    }
  }

  const updateDemoProfile = (
    index: number,
    key: keyof DemoPreviewForm['profiles'][number],
    value: string,
  ) => {
    setDemoForm((current) => {
      if (!current) return current
      return {
        ...current,
        profiles: current.profiles.map((profile, profileIndex) =>
          profileIndex === index ? { ...profile, [key]: value } : profile,
        ),
      }
    })
  }

  const updateDemoEvent = (
    index: number,
    key: keyof DemoPreviewForm['events'][number],
    value: string | boolean,
  ) => {
    setDemoForm((current) => {
      if (!current) return current
      return {
        ...current,
        events: current.events.map((event, eventIndex) =>
          eventIndex === index ? { ...event, [key]: value } : event,
        ),
      }
    })
  }

  const updateDemoGiftAccount = (
    index: number,
    key: keyof DemoPreviewForm['giftAccounts'][number],
    value: string,
  ) => {
    setDemoForm((current) => {
      if (!current) return current
      return {
        ...current,
        giftAccounts: current.giftAccounts.map((account, accountIndex) =>
          accountIndex === index ? { ...account, [key]: value } : account,
        ),
      }
    })
  }

  const addDemoGiftAccount = () => {
    setDemoForm((current) => {
      if (!current || current.giftAccounts.length >= 2) return current
      return {
        ...current,
        giftAccounts: [
          ...current.giftAccounts,
          { bankName: '', accountNumber: '', accountHolder: '' },
        ],
      }
    })
  }

  const removeDemoGiftAccount = (index: number) => {
    setDemoForm((current) => current ? {
      ...current,
      giftAccounts: current.giftAccounts.filter((_, accountIndex) => accountIndex !== index),
    } : current)
  }

  const uploadDemoAsset = async (file: File) => {
    const response = await adminUploadSapatamuDemoPreviewAsset<UploadedDemoAsset>(file)
    return response.data?.url ?? ''
  }

  const uploadDemoProfilePhoto = async (index: number, fileList: FileList | null) => {
    const file = fileList?.[0]
    if (!file) return
    setIsSaving(true)
    try {
      const url = await uploadDemoAsset(file)
      if (url) updateDemoProfile(index, 'photoUrl', url)
    } finally {
      setIsSaving(false)
    }
  }

  const uploadDemoGalleryImages = async (fileList: FileList | null) => {
    const files = Array.from(fileList ?? [])
    if (files.length === 0) return
    setIsSaving(true)
    try {
      const urls = (await Promise.all(files.map((file) => uploadDemoAsset(file)))).filter(Boolean)
      if (urls.length > 0) {
        setDemoForm((current) => current ? {
          ...current,
          galleryImageUrls: [...current.galleryImageUrls, ...urls].slice(0, 20),
        } : current)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const uploadDemoMusic = async (fileList: FileList | null) => {
    const file = fileList?.[0]
    if (!file) return
    setIsSaving(true)
    try {
      const url = await uploadDemoAsset(file)
      if (url) setDemoForm((current) => current ? { ...current, musicUrl: url } : current)
    } finally {
      setIsSaving(false)
    }
  }

  const saveDemoPreview = async () => {
    if (!templateId || !demoForm) return
    setIsSaving(true)
    try {
      const response = await adminSaveSapatamuTemplateDemoPreview<AdminSapatamuDemoPreviewPayload>(templateId, demoForm)
      if (response.data) {
        setDemoPreview(response.data)
        setDemoForm(response.data.settings)
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (!payload || !documentValue || !selectedPage) {
    return (
      <AdminEditorShell title="Template Editor" subtitle="Memuat default template" workspaceMode>
        <div className="grid h-full place-items-center p-4">
          <div className="rounded-2xl border border-dashed border-border p-8 text-sm text-muted-foreground">Memuat editor template...</div>
        </div>
      </AdminEditorShell>
    )
  }

  const demoValue = demoForm ?? buildEmptyDemoPreviewForm()
  const demoPublicUrl = demoPreview?.publicUrl ?? ''

  return (
    <AdminEditorShell title={`Default Template: ${payload.template.name}`} subtitle="Atur default layout, background, ornament, frame, dan asset tema" workspaceMode>
      <div className="sapatamu-editor-shell admin-template-editor-shell h-[100dvh] overflow-hidden p-2 sm:p-3">
        <div className="sapatamu-editor-workspace">
          <aside className="sapatamu-editor-sidebar flex flex-col overflow-hidden rounded-[22px] border border-white/50 shadow-[0_30px_90px_rgba(15,23,42,0.12)]">
            {isLayoutSettingMode ? (
              <>
                <div className="sapatamu-editor-panel-header grid h-[78px] shrink-0 grid-cols-[48px_1fr_72px] items-center border-b border-white/50 px-4">
                  <Button type="button" variant="ghost" size="icon" className="rounded-full text-slate-500" onClick={exitLayoutSettingMode}>
                    <ArrowLeft className="size-5" />
                  </Button>
                  <div className="min-w-0 text-center">
                    <h3 className="truncate text-xl font-semibold text-slate-950">
                      {selectedElementValue ? String(selectedElementValue.type ?? selectedElement) : selectedPage.title}
                    </h3>
                    <p className="truncate text-xs text-slate-400">
                      {selectedElement ? selectedElement : `${selectedPage.title} - pilih elemen di preview`}
                    </p>
                  </div>
                  <Switch
                    checked={selectedElementValue ? selectedElementValue.disabled !== true : selectedPage.isActive}
                    onCheckedChange={(checked) => {
                      if (selectedElement && selectedElementValue) {
                        updatePageData(`${selectedElement}.disabled`, !checked)
                        return
                      }
                      updateSelectedPage({ isActive: checked })
                    }}
                  />
                </div>
                <div className="sapatamu-inspector-body flex-1 overflow-y-auto p-5">
                  {!selectedElementValue ? (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-6 text-center">
                      <p className="text-sm font-semibold text-slate-900">{selectedPage.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Klik salah satu elemen pada canvas untuk membuka setting default visual.
                      </p>
                      <p className="mt-3 text-xs text-slate-400">{selectedPage.layoutCode} · {selectedPage.family}</p>
                    </div>
                  ) : (
                    <ElementDesignInspector
                      elementKey={selectedElement ?? ''}
                      element={selectedElementValue}
                      fonts={payload.catalog.fonts}
                      onChange={updatePageData}
                    />
                  )}
                </div>
                <div className="shrink-0 border-t border-slate-200 bg-white/90 p-4 backdrop-blur">
                  <Button className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700" disabled={isSaving} onClick={() => void saveCurrentLayout()}>
                    {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                    Simpan & Kembali
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="sapatamu-editor-panel-header shrink-0 border-b border-white/50 px-5 py-4">
                  <div className="grid grid-cols-[44px_1fr_auto] items-center gap-3">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate('/admin/products/sapatamu/templates')}>
                      <ArrowLeft className="size-5" />
                    </Button>
                    <div className="min-w-0 text-center">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Template Default</p>
                      <h3 className="truncate text-lg font-semibold text-slate-950">{payload.template.name}</h3>
                    </div>
                    <Badge variant="outline">{payload.template.code}</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {(['layout', 'background', 'assets', 'demo'] as PanelMode[]).map((mode) => (
                      <Button key={mode} size="sm" variant={panelMode === mode ? 'default' : 'outline'} className="rounded-full" onClick={() => setPanelMode(mode)}>
                        {mode}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="sapatamu-sidebar-scroll flex-1 space-y-5 overflow-y-auto p-5">
                  {panelMode === 'layout' ? (
                    <div className="rounded-3xl bg-white/80 p-4 sapatamu-editor-card">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Layout Defaults</p>
                      <div className="mt-4 space-y-2">
                        {documentValue.editor.pages.map((page) => (
                          <div
                            key={page.layoutCode}
                            role="button"
                            tabIndex={0}
                            className={`w-full rounded-2xl border px-4 py-3 text-left transition ${page.layoutCode === selectedPage.layoutCode ? 'border-emerald-400 bg-emerald-50' : 'border-border bg-white/70 hover:border-slate-300'} ${page.isActive ? '' : 'opacity-65'}`}
                            onClick={() => {
                              setSelectedLayoutCode(page.layoutCode)
                              setSearchParams({})
                            }}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                setSelectedLayoutCode(page.layoutCode)
                                setSearchParams({})
                              }
                            }}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold text-slate-900">{page.title}</p>
                                  <Badge variant={page.isActive ? 'default' : 'outline'}>{page.isActive ? 'Aktif' : 'Nonaktif'}</Badge>
                                </div>
                                <p className="mt-1 text-xs text-slate-500">{page.layoutCode}</p>
                              </div>
                              <div className="flex shrink-0 items-center gap-2">
                                <Switch
                                  checked={page.isActive}
                                  disabled={isSaving}
                                  onClick={(event) => event.stopPropagation()}
                                  onCheckedChange={(checked) => {
                                    const nextPage = { ...page, isActive: checked }
                                    updateSelectedPage(page.layoutCode === selectedPage.layoutCode ? { isActive: checked } : {})
                                    setDocumentValue((current) => current ? {
                                      ...current,
                                      editor: {
                                        ...current.editor,
                                        pages: current.editor.pages.map((item) => item.layoutCode === page.layoutCode ? nextPage : item),
                                      },
                                    } : current)
                                    void saveLayout(nextPage)
                                  }}
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="rounded-full"
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    setSelectedLayoutCode(page.layoutCode)
                                    setSearchParams({})
                                    setIsLayoutSettingMode(true)
                                  }}
                                >
                                  <Pencil className="mr-2 size-3" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {panelMode === 'background' ? (
                    <div className="rounded-3xl bg-white/80 p-4 sapatamu-editor-card">
                      <Label>Global Background URL</Label>
                      <Textarea
                        className="mt-2 min-h-24 rounded-2xl"
                        value={documentValue.editor.globalBackground ?? ''}
                        onChange={(event) => updateGlobalBackground(event.target.value)}
                      />
                      <Button className="mt-4 w-full rounded-2xl" disabled={isSaving || !documentValue.editor.globalBackground} onClick={() => void upsertBackgroundAsset()}>
                        <ImagePlus className="mr-2 size-4" />
                        Simpan Background Asset
                      </Button>
                    </div>
                  ) : null}

                  {panelMode === 'assets' ? (
                    <>
                      <div className="rounded-3xl bg-white/80 p-4 sapatamu-editor-card">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Asset Library</p>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          {payload.assets.map((asset) => (
                            <button
                              key={asset.id}
                              type="button"
                              className={`overflow-hidden rounded-2xl border text-left ${selectedAssetId === asset.id ? 'border-emerald-400' : 'border-border'}`}
                              onClick={() => setSelectedAssetId(asset.id)}
                            >
                              <div className="h-20 bg-slate-100">
                                {asset.asset_type === 'music' ? (
                                  <div className="grid size-full place-items-center text-xs text-slate-400">AUDIO</div>
                                ) : (
                                  <img src={resolveApiAssetUrl(asset.url)} alt="" className="size-full object-cover" />
                                )}
                              </div>
                              <div className="p-2">
                                <p className="truncate text-xs font-semibold">{asset.asset_key}</p>
                                <p className="text-[10px] text-slate-500">{asset.asset_type}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-3xl bg-white/80 p-4 sapatamu-editor-card">
                        <AssetInspector asset={selectedAsset} onSave={(asset, patch) => void saveAsset(asset, patch)} />
                      </div>
                    </>
                  ) : null}

                  {panelMode === 'demo' ? (
                    <div className="space-y-4 rounded-3xl bg-white/80 p-4 sapatamu-editor-card">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Demo Publik Global</p>
                          <p className="mt-1 text-xs leading-5 text-slate-500">Data ini dipakai semua tema preview publik. Simpan akan membangun ulang semua demo aktif.</p>
                        </div>
                        <Switch
                          checked={demoValue.enabled}
                          onCheckedChange={(checked) => setDemoForm({ ...demoValue, enabled: checked })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => window.open(demoPublicUrl, '_blank', 'noopener,noreferrer')}
                          disabled={!demoPublicUrl}
                        >
                          <ExternalLink className="mr-2 size-3" />
                          Buka {demoPublicUrl}
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {demoValue.profiles.map((profile, index) => (
                          <div key={profile.id} className="space-y-2 rounded-2xl border border-border bg-white/70 p-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{profile.label}</p>
                            <Input value={profile.fullName} onChange={(event) => updateDemoProfile(index, 'fullName', event.target.value)} placeholder="Nama lengkap" />
                            <Input value={profile.nickName} onChange={(event) => updateDemoProfile(index, 'nickName', event.target.value)} placeholder="Nama panggilan" />
                            <Textarea value={profile.description} onChange={(event) => updateDemoProfile(index, 'description', event.target.value)} placeholder="Deskripsi/orang tua" className="min-h-20 rounded-2xl" />
                            <div className="space-y-2">
                              {profile.photoUrl ? (
                                <img src={resolveApiAssetUrl(profile.photoUrl)} alt="" className="h-32 w-full rounded-2xl object-cover" />
                              ) : (
                                <div className="grid h-32 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400">
                                  Foto belum diunggah
                                </div>
                              )}
                              <div className="flex gap-2">
                                <Label className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700">
                                  <Upload className="mr-2 size-3" />
                                  {profile.photoUrl ? 'Ganti foto' : 'Upload foto'}
                                  <Input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    disabled={isSaving}
                                    onChange={(event) => {
                                      void uploadDemoProfilePhoto(index, event.currentTarget.files)
                                      event.currentTarget.value = ''
                                    }}
                                  />
                                </Label>
                                {profile.photoUrl ? (
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    className="rounded-full"
                                    onClick={() => updateDemoProfile(index, 'photoUrl', '')}
                                    disabled={isSaving}
                                  >
                                    <Trash2 className="size-3" />
                                  </Button>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        {demoValue.events.map((event, index) => (
                          <div key={event.id} className="space-y-2 rounded-2xl border border-border bg-white/70 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{event.name || `Event ${index + 1}`}</p>
                              <Switch checked={event.enabled} onCheckedChange={(checked) => updateDemoEvent(index, 'enabled', checked)} />
                            </div>
                            <Input value={event.name} onChange={(inputEvent) => updateDemoEvent(index, 'name', inputEvent.target.value)} placeholder="Nama acara" />
                            <div className="grid grid-cols-2 gap-2">
                              <Input type="date" value={event.date} onChange={(inputEvent) => updateDemoEvent(index, 'date', inputEvent.target.value)} />
                              <Input value={event.timeZone} onChange={(inputEvent) => updateDemoEvent(index, 'timeZone', inputEvent.target.value)} placeholder="WIB" />
                              <Input type="time" value={event.timeStart} onChange={(inputEvent) => updateDemoEvent(index, 'timeStart', inputEvent.target.value)} />
                              <Input type="time" value={event.timeEnd} onChange={(inputEvent) => updateDemoEvent(index, 'timeEnd', inputEvent.target.value)} />
                            </div>
                            <Textarea value={event.address} onChange={(inputEvent) => updateDemoEvent(index, 'address', inputEvent.target.value)} placeholder="Alamat acara" className="min-h-20 rounded-2xl" />
                            <Input value={event.mapLocation} onChange={(inputEvent) => updateDemoEvent(index, 'mapLocation', inputEvent.target.value)} placeholder="Link Google Maps" />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3 rounded-2xl border border-border bg-white/70 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <Label>Kirim Angpao</Label>
                            <p className="mt-1 text-xs leading-5 text-slate-500">Rekening ini tampil di modal angpao demo publik.</p>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="rounded-full"
                            onClick={addDemoGiftAccount}
                            disabled={isSaving || demoValue.giftAccounts.length >= 2}
                          >
                            Tambah
                          </Button>
                        </div>
                        {demoValue.giftAccounts.length > 0 ? (
                          <div className="space-y-3">
                            {demoValue.giftAccounts.map((account, index) => (
                              <div key={`demo-gift-account-${index}`} className="space-y-2 rounded-2xl border border-slate-100 bg-white p-3">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Rekening {index + 1}</p>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="size-8 rounded-full text-slate-400"
                                    onClick={() => removeDemoGiftAccount(index)}
                                    disabled={isSaving}
                                  >
                                    <Trash2 className="size-3" />
                                  </Button>
                                </div>
                                <Input value={account.bankName} onChange={(event) => updateDemoGiftAccount(index, 'bankName', event.target.value)} placeholder="Nama bank / e-wallet" />
                                <Input value={account.accountNumber} onChange={(event) => updateDemoGiftAccount(index, 'accountNumber', event.target.value)} placeholder="Nomor rekening / nomor tujuan" />
                                <Input value={account.accountHolder} onChange={(event) => updateDemoGiftAccount(index, 'accountHolder', event.target.value)} placeholder="Nama pemilik" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid h-16 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400">
                            Rekening angpao demo belum diisi
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 rounded-2xl border border-border bg-white/70 p-3">
                        <Label>Kirim Kado</Label>
                        <p className="text-xs leading-5 text-slate-500">Alamat ini tampil di modal kado demo publik.</p>
                        <Textarea
                          value={demoValue.giftAddress}
                          onChange={(event) => setDemoForm({ ...demoValue, giftAddress: event.target.value })}
                          placeholder="Alamat pengiriman kado"
                          className="min-h-24 rounded-2xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <Label>Galeri demo</Label>
                          <Label className="inline-flex h-9 cursor-pointer items-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700">
                            <ImagePlus className="mr-2 size-3" />
                            Upload foto
                            <Input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              multiple
                              className="hidden"
                              disabled={isSaving}
                              onChange={(event) => {
                                void uploadDemoGalleryImages(event.currentTarget.files)
                                event.currentTarget.value = ''
                              }}
                            />
                          </Label>
                        </div>
                        {demoValue.galleryImageUrls.length > 0 ? (
                          <div className="grid grid-cols-2 gap-2">
                            {demoValue.galleryImageUrls.map((url, index) => (
                              <div key={`${url}-${index}`} className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                                <img src={resolveApiAssetUrl(url)} alt="" className="h-24 w-full object-cover" />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="destructive"
                                  className="absolute right-2 top-2 size-7 rounded-full opacity-0 transition group-hover:opacity-100"
                                  onClick={() => setDemoForm({
                                    ...demoValue,
                                    galleryImageUrls: demoValue.galleryImageUrls.filter((_, imageIndex) => imageIndex !== index),
                                  })}
                                >
                                  <Trash2 className="size-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid h-24 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400">
                            Galeri belum diunggah
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <Label>Musik demo</Label>
                          <Label className="inline-flex h-9 cursor-pointer items-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700">
                            <Upload className="mr-2 size-3" />
                            {demoValue.musicUrl ? 'Ganti musik' : 'Upload musik'}
                            <Input
                              type="file"
                              accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
                              className="hidden"
                              disabled={isSaving}
                              onChange={(event) => {
                                void uploadDemoMusic(event.currentTarget.files)
                                event.currentTarget.value = ''
                              }}
                            />
                          </Label>
                        </div>
                        {demoValue.musicUrl ? (
                          <div className="rounded-2xl border border-slate-100 bg-white p-3">
                            <audio src={resolveApiAssetUrl(demoValue.musicUrl)} controls className="w-full" />
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="mt-2 rounded-full text-slate-500"
                              onClick={() => setDemoForm({ ...demoValue, musicUrl: '' })}
                              disabled={isSaving}
                            >
                              <Trash2 className="mr-2 size-3" />
                              Hapus musik
                            </Button>
                          </div>
                        ) : (
                          <div className="grid h-16 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400">
                            Musik belum diunggah
                          </div>
                        )}
                      </div>

                      <Button className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700" disabled={isSaving} onClick={() => void saveDemoPreview()}>
                        {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                        Simpan Demo Global
                      </Button>
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </aside>

          <section className="sapatamu-editor-preview-stage" style={previewStageStyle}>
            <Button
              type="button"
              variant="outline"
              className="sapatamu-editor-background-action rounded-full"
              onClick={() => {
                setIsLayoutSettingMode(false)
                setPanelMode('background')
              }}
            >
              <ImagePlus className="mr-2 size-4" />
              Background
            </Button>
            <div className="sapatamu-editor-live-canvas">
              <div className="flex h-full flex-col">
                <div className="relative min-h-0 flex-[0_0_100%] p-0">
                  <PreviewPage
                    page={selectedPage}
                    invitationId={templateId}
                    selectedElement={isLayoutSettingMode ? selectedElement : null}
                    documentValue={documentValue}
                    invitationLink={`/${payload.template.code}`}
                    fonts={payload.catalog.fonts}
                    fallbackImages={fallbackImages}
                    onOpenLightbox={() => undefined}
                    isEditing={isLayoutSettingMode}
                    resolveTokens={false}
                  />
                  <div className={`pointer-events-none absolute inset-0 z-30 mx-auto w-[min(430px,100%)] ${isLayoutSettingMode ? 'hidden' : ''}`}>
                    {ornamentAssets.map((asset) => {
                      const slot = getAssetSlot(asset)
                      const style = ORNAMENT_HIT_STYLES[slot]
                      if (!style) return null
                      return (
                        <button
                          key={asset.id}
                          type="button"
                          style={style}
                          className={`pointer-events-auto absolute rounded-2xl border-2 bg-emerald-500/10 text-[10px] font-semibold uppercase tracking-[0.14em] text-white opacity-0 shadow transition hover:opacity-100 focus:opacity-100 ${selectedAssetId === asset.id ? 'border-emerald-300 opacity-100' : 'border-white/40'}`}
                          onClick={() => {
                            setSelectedAssetId(asset.id)
                            setPanelMode('assets')
                          }}
                        >
                          <span className="rounded-full bg-slate-950/65 px-2 py-1">{slot}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminEditorShell>
  )
}
