import { Spinner } from "./ios-spinner"

export function SpinnerDemo() {
    return (
        <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground uppercase tracking-widest">Small</span>
                <Spinner size="sm" />
            </div>
            <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground uppercase tracking-widest">Medium</span>
                <Spinner size="md" />
            </div>
            <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground uppercase tracking-widest">Large</span>
                <Spinner size="lg" />
            </div>
        </div>
    )
}
