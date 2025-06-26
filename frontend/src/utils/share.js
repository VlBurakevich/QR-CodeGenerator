export const handleShareLink = async (valueToShare) => {
    if (!valueToShare) {
        return { success: false, message: 'Nothing to share.' };
    }

    const shareData = {
        title: 'QR Code Content',
        text: valueToShare,
    };

    try {
        new URL(valueToShare);
        shareData.url = valueToShare;
    } catch (_) {
    }


    if (navigator.share) {
        try {
            await navigator.share(shareData);
            return { success: true, method: 'share', message: 'Shared successfully!' };
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Error using Web Share API:', err);
                return { success: false, message: 'Could not share.' };
            }
            return { success: false, message: 'Share cancelled.' };
        }
    } else {
        try {
            await navigator.clipboard.writeText(valueToShare);
            return { success: true, method: 'copy', message: 'Link copied to clipboard!' };
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
            return { success: false, message: 'Failed to copy link.' };
        }
    }
};