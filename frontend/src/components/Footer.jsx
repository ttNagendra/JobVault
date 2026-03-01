/**
 * Footer — Minimal, clean
 */

export default function Footer() {
    return (
        <footer className="border-t border-gray-800/50 dark:border-gray-800/50 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <p className="text-center text-gray-500 dark:text-gray-600 text-xs">
                    &copy; {new Date().getFullYear()} JobVault. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
