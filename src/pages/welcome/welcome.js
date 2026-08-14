import { getResolvedKeyBindings } from "cm/commandRegistry";
import logoSrc from "components/logo/logo.png?inline";
import config from "lib/config";
import EditorFile from "lib/editorFile";
import openFile from "lib/openFile";
import openFolder from "lib/openFolder";
import recents from "lib/recents";
import Url from "utils/Url";

/**
 * Opens the Welcome tab as an EditorFile page
 */
export default function openWelcomeTab() {
	// Check if welcome tab is already open
	const existingFile = editorManager.files.find((f) => f.id === "welcome-tab");
	if (existingFile) {
		existingFile.makeActive();
		return;
	}

	const welcomeContent = createWelcomeContent();

	const welcomeFile = new EditorFile("Welcome", {
		id: "welcome-tab",
		render: true,
		type: "page",
		content: welcomeContent,
		tabIcon: "icon acode",
		hideQuickTools: true,
	});

	// Set custom subtitle for the header
	welcomeFile.setCustomTitle(() => "Get Started");
}

/**
 * Creates the welcome tab content
 * @returns {HTMLElement}
 */
function createWelcomeContent() {
	const bindings = getResolvedKeyBindings();
	const kb = (name) => {
		const binding = bindings[name];
		return binding?.key ? binding.key.split("|")[0].replace(/-/g, "+") : "";
	};

	const recentFilesList = recents.files || [];
	const recentFoldersList = recents.folders || [];
	const hasRecents = recentFilesList.length > 0 || recentFoldersList.length > 0;

	return (
		<div id="welcome-tab" className="welcome-page scroll">
			{/* Hero Section */}
			<header className="welcome-header">
				<img className="logo" src={logoSrc} width="48" height="48" alt="" />
				<div className="welcome-header-text">
					<h1>Welcome to DexCode</h1>
					<p className="tagline">Modern Cross-Platform Desktop & Web Code Editor</p>
				</div>
			</header>

			{/* Get Started Section */}
			<section className="welcome-section">
				<h2 className="section-label">GET STARTED</h2>
				<div className="action-list">
					<ActionRow
						icon="add"
						label={strings["new file"]}
						shortcut={kb("newFile")}
						onClick={() => acode.exec("new-file")}
					/>
					<ActionRow
						icon="document-text-outline"
						label={strings["open file"]}
						shortcut={kb("openFile")}
						onClick={() => acode.exec("open-file")}
					/>
					<ActionRow
						icon="folder_open"
						label={strings["open folder"]}
						shortcut={kb("openFolder")}
						onClick={() => acode.exec("open-folder")}
					/>
					<ActionRow
						icon="terminal"
						label={strings.terminal}
						shortcut={kb("openTerminal")}
						onClick={() => acode.exec("new-terminal")}
					/>
					<ActionRow
						icon="historyrestore"
						label={strings.recent}
						onClick={() => acode.exec("recent")}
					/>
					<ActionRow
						icon="tune"
						label={strings["command palette"]}
						shortcut={kb("openCommandPalette")}
						onClick={() => acode.exec("command-palette")}
					/>
				</div>
			</section>

			{/* Recent Files & Projects Section */}
			{hasRecents && (
				<section className="welcome-section">
					<h2 className="section-label">RECENT FILES & PROJECTS</h2>
					<div className="action-list">
						{recentFoldersList.slice(0, 5).map((folder) => {
							const url = folder.url;
							const name = Url.basename(url) || url;
							return (
								<ActionRow
									icon="folder"
									label={name}
									shortcut={url}
									onClick={() => openFolder(url, folder.opts)}
								/>
							);
						})}
						{recentFilesList.slice(0, 5).map((filePath) => {
							const name = Url.basename(filePath) || filePath;
							return (
								<ActionRow
									icon="file"
									label={name}
									shortcut={filePath}
									onClick={() => openFile(filePath)}
								/>
							);
						})}
					</div>
				</section>
			)}

			{/* Configure Section */}
			<section className="welcome-section">
				<h2 className="section-label">CONFIGURE</h2>
				<div className="action-list">
					<ActionRow
						icon="settings"
						label={strings.settings}
						onClick={() => acode.exec("open", "settings")}
					/>
					<ActionRow
						icon="color_lenspalette"
						label={strings["change theme"]}
						onClick={() => acode.exec("change-app-theme")}
					/>
					<ActionRow
						icon="extension"
						label={strings.explore + " " + strings.plugins}
						onClick={() => acode.exec("open", "plugins")}
					/>
				</div>
			</section>

			{/* Learn Section */}
			<section className="welcome-section">
				<h2 className="section-label">LEARN</h2>
				<div className="action-list">
					<ActionRow
						icon="help"
						label={strings.help}
						onClick={() => acode.exec("open", "help")}
					/>
					<ActionRow
						icon="info_outline"
						label={strings.about}
						onClick={() => acode.exec("open", "about")}
					/>
				</div>
			</section>

			{/* Links Section */}
			<section className="welcome-section welcome-links">
				<h2 className="section-label">CONNECT</h2>
				<div className="link-row">
					<LinkItem icon="acode" label="Website" url={config.BASE_URL} />
					<LinkItem icon="github" label="GitHub" url={config.GITHUB_URL} />
					<LinkItem
						icon="telegram"
						label="Telegram"
						url={config.TELEGRAM_URL}
					/>
					<LinkItem icon="discord" label="Discord" url={config.DISCORD_URL} />
				</div>
			</section>
		</div>
	);
}

/**
 * Action row component
 */
function ActionRow({ icon, label, shortcut, onClick }) {
	return (
		<div className="action-row" onclick={onClick}>
			<span className={`icon ${icon}`}></span>
			<span className="action-label">{label}</span>
			{shortcut && <span className="action-shortcut">{shortcut}</span>}
		</div>
	);
}

/**
 * Link item component - opens URL in external browser
 */
function LinkItem({ icon, label, url }) {
	const handleClick = (e) => {
		e.preventDefault();
		system.openInBrowser(url);
	};

	return (
		<a href={url} className="link-item" onclick={handleClick}>
			<span className={`icon ${icon}`}></span>
			<span>{label}</span>
		</a>
	);
}
