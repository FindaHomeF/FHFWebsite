"use client"
import { Button } from "@/components/ui/button";
import { CiShare2 } from "react-icons/ci";
import { toast } from "sonner";

const ShareButton = ({ 
    shareUrl, 
    variant = "outline",
    className = "", 
    iconOnly = false,
    buttonText = "Share",
    successMessage = "Link copied to clipboard!",
    errorMessage = "Failed to copy link!"
}) => {
    const handleShare = async () => {
        try {
            // Construct the full URL if shareUrl is a relative path
            const fullUrl = shareUrl.startsWith('http') 
                ? shareUrl 
                : `${window.location.origin}${shareUrl.startsWith('/') ? shareUrl : `/${shareUrl}`}`;
            
            await navigator.clipboard.writeText(fullUrl);
            toast.success(successMessage);
        } catch (err) {
            console.error("Share error:", err);
            toast.error(errorMessage);
        }
    };

    return (
        <Button
            className={`
                rounded-full flex items-center gap-x-2 justify-center border border-borderGray 
                bg-transparent text-primary hover:bg-primary hover:text-white hover:border-primary
                ${className}
            `}
            onClick={handleShare}
            variant={variant}
            type="button"
            aria-label={iconOnly ? buttonText : undefined}
        >
            <CiShare2 className="font-bold transition-colors" />
            {!iconOnly && <h6 className="hidden md:block">{buttonText}</h6>}
        </Button>
    );
};

export default ShareButton;

