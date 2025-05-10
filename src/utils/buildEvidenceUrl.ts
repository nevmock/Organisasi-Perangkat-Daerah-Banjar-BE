// utils/buildEvidenceUrl.ts
export function buildEvidenceUrls(files: Express.Multer.File[], baseUrl: string) {
    return files.map(file => `${baseUrl}/${file.path.replace(/\\/g, '/')}`);
}
