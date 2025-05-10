import fs from 'fs';
import path from 'path';

/**
 * Delete a file from local file system (based on full URL path)
 */
export function deleteEvidenceFile(evidenceUrl: string) {
    const relativePath = evidenceUrl.replace(/^.*\/public\//, 'public/'); // clean URL → path
    const filePath = path.resolve(relativePath);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
    }

    return false;
}
