import ElectronIPC from "lib/electron-ipc";

/**
 * Custom Window Controls component for the top bar
 * Handles minimize, maximize/restore, and close actions using Electron IPC.
 * @returns {HTMLElement|null}
 */
export default function WindowControls() {
	const isElectron =
		typeof window !== "undefined" &&
		!!(window.dexcodeBridge || window.dexcodeNative || window.__DEXCODE_RUNTIME__ === "electron");

	if (!isElectron) {
		return null;
	}

	const handleMinimize = async (e) => {
		e.stopPropagation();
		try {
			if (window.dexcodeBridge?.windowControls) {
				await window.dexcodeBridge.windowControls.minimize();
			} else if (window.dexcodeNative?.windowControls) {
				await window.dexcodeNative.windowControls.minimize();
			} else {
				await ElectronIPC.windowControls.minimize();
			}
		} catch (err) {
			console.warn("Failed to minimize window:", err);
		}
	};

	const handleMaximize = async (e) => {
		e.stopPropagation();
		try {
			if (window.dexcodeBridge?.windowControls) {
				await window.dexcodeBridge.windowControls.maximize();
			} else if (window.dexcodeNative?.windowControls) {
				await window.dexcodeNative.windowControls.maximize();
			} else {
				await ElectronIPC.windowControls.maximize();
			}
		} catch (err) {
			console.warn("Failed to maximize/restore window:", err);
		}
	};

	const handleClose = async (e) => {
		e.stopPropagation();
		try {
			if (window.dexcodeBridge?.windowControls) {
				await window.dexcodeBridge.windowControls.close();
			} else if (window.dexcodeNative?.windowControls) {
				await window.dexcodeNative.windowControls.close();
			} else {
				await ElectronIPC.windowControls.close();
			}
		} catch (err) {
			console.warn("Failed to close window:", err);
		}
	};

	return (
		<div
			className="window-controls"
			style={{
				display: "inline-flex",
				alignItems: "center",
				marginLeft: "8px",
				gap: "2px",
			}}
		>
			<button
				type="button"
				className="win-btn win-btn-minimize"
				title="Minimize"
				style={{
					background: "transparent",
					border: "none",
					color: "inherit",
					cursor: "pointer",
					padding: "4px 8px",
					fontSize: "14px",
					lineHeight: "1",
					borderRadius: "3px",
				}}
				onclick={handleMinimize}
			>
				&#x2212;
			</button>
			<button
				type="button"
				className="win-btn win-btn-maximize"
				title="Maximize / Restore"
				style={{
					background: "transparent",
					border: "none",
					color: "inherit",
					cursor: "pointer",
					padding: "4px 8px",
					fontSize: "14px",
					lineHeight: "1",
					borderRadius: "3px",
				}}
				onclick={handleMaximize}
			>
				&#x25A2;
			</button>
			<button
				type="button"
				className="win-btn win-btn-close"
				title="Close"
				style={{
					background: "transparent",
					border: "none",
					color: "inherit",
					cursor: "pointer",
					padding: "4px 8px",
					fontSize: "14px",
					lineHeight: "1",
					borderRadius: "3px",
				}}
				onclick={handleClose}
			>
				&#x2715;
			</button>
		</div>
	);
}
