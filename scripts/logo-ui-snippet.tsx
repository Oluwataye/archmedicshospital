// Logo upload section component for Hospital Information tab
// Add this section after the hospital name field and before the abbreviation field

<div className="space-y-2">
    <Label>Hospital Logo</Label>
    <div className="flex flex-col gap-4">
        {/* Current Logo Display */}
        {hospitalSettings?.logo_url && !logoPreview && (
            <div className="flex items-center gap-4 p-4 border rounded-lg">
                <img
                    src={`http://localhost:3001${hospitalSettings.logo_url}`}
                    alt="Current Hospital Logo"
                    className="h-20 w-20 object-contain"
                />
                <div className="flex-1">
                    <p className="font-medium">Current Logo</p>
                    <p className="text-sm text-muted-foreground">This logo appears in the sidebar, login page, and receipts</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveLogo}
                    disabled={uploadingLogo}
                >
                    Remove
                </Button>
            </div>
        )}

        {/* Logo Preview */}
        {logoPreview && (
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="h-20 w-20 object-contain"
                />
                <div className="flex-1">
                    <p className="font-medium">Preview</p>
                    <p className="text-sm text-muted-foreground">{logoFile?.name}</p>
                </div>
                <Button
                    onClick={handleUploadLogo}
                    disabled={uploadingLogo}
                    size="sm"
                >
                    {uploadingLogo ? 'Uploading...' : 'Upload'}
                </Button>
            </div>
        )}

        {/* File Input */}
        <div className="flex items-center gap-2">
            <Input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                onChange={handleLogoFileChange}
                disabled={uploadingLogo}
                className="cursor-pointer"
            />
        </div>
        <p className="text-xs text-muted-foreground">
            Recommended: Square image (200x200px), PNG or JPG format, max 2MB
        </p>
    </div>
</div>
