var l10n = {
"Bytes":"位元組",
"KB":"千位元組",
"MB":"兆位元組",
"GB":"吉位元組",
"TB":"太位元組",
"PB":"拍位元組",
"EB":"艾位元組",
"ZB":"澤位元組",
"YB":"堯位元組",
"Networking":"網路連線",
"Interface configuration":"介面配置",
"Wi-Fi":"無線保真",
"DNS and Auto Configuration":"域名系統和自動配置",
"System management":"系統管理",
"Addon":"附加元件",
"Multihoming":"多宿主",
"Miscellaneous and Tweaks":"雜項與微調",
"Scheduled Tasks":"計劃任務",
"Connected device":"已連線的裝置",
"Web console preferences":"Web 控制檯偏好",
"Software update":"軟體更新",
"About Ranga":"關於 Ranga",
"Network error or web console error":"網路錯誤或 Web 控制檯錯誤",
"Loading":"載入中",
"A network error or web console error occurred while loading the page":"載入頁面過程中發生網路錯誤或 Web 控制檯錯誤",
"Failed to load":"載入失敗",
"Login":"登入",
"Please enter the superuser password to complete the login<br><br><input style='width: 100%' type=password placeholder='ranga will be used when empty'>":"請輸入超級使用者密碼以完成登入<br><br><input style='width: 100%' type=password placeholder='置空將嘗試預設密碼 ranga'>",
"You have passed the authentication. Switch to superuser status. There is no change in appearance on the web console, and the difference can only be seen when performing privileged operations. When you close your browser, restart NSWA Ranga, or another terminal re-login, this session will automatically expire.":"您已經通過鑑權。切換為超級使用者身份。Web 控制檯上外觀不會有變化，在執行特權操作時才能看出差異。關閉瀏覽器、重啟 NSWA Ranga、另一終端重新登入時本次授權將會自動失效。",
"OK":"好",
"Cancel":"取消",
"Full package update failed":"完整包更新失敗",
"The last full package update failed, possibly due to insufficient memory or hardware failure, please try again. If retrying multiple times still does not solve the problem, try turning off some of the system services and reducing the number of connections and try again.":"上次完整包更新失敗，可能是因為記憶體不足或硬體故障，請重試。如果多次重試仍然不能解決問題，請嘗試關掉一部分系統服務，並減少連線人數後重試。",
"Full package update failed. Please try again.":"上次完整包更新失敗，請重試。",
"Please wait":"請稍候",
"The third-party theme currently in use is not compatible with Web Console":"當前使用的第三方主題與 Web 控制檯不相容",
"Please check the updated version from the third-party source for the theme that is compatible with the latest Web Console.":"請從第三方主題來源檢查更新的版本，以獲取和最新 Web 控制檯相容的主題。",
"External application request":"外部應用程式請求",
"The site at <b>{0}</b> is trying to set a custom theme to your NSWA Ranga Web Console. Installing a third-party theme can lead to malicious tampering with the appearance of the Web Console, which can be deceived.":"位於 <b>{0}</b> 的站點正試圖向你的 NSWA Ranga 的 Web 控制檯設定自定義主題。安裝第三方主題可能會導致 Web 控制檯外觀被惡意篡改，從而使你受騙。",
"<br><br>Your connection to this site is not a private connection. This means that your data is transmitted over the Internet without encryption, which can cause the theme to be maliciously replaced.":"<br><br>您與此站點的連線不是私密連線。這意味著你的資料未經加密在網際網路上傳輸，這可能導致主題被惡意替換。",
"Continue":"繼續",
"Refuse":"拒絕",
"The site at <b>{0}</b> is trying to install an extension to your NSWA Ranga. Installing third-party extensions can adversely affect the performance and stability of the NSWA Ranga system. Please continue to operate only in very clear circumstances.":"位於 <b>{0}</b> 的站點正試圖向你的 NSWA Ranga 安裝擴充套件程式。安裝第三方擴充套件程式可能對 NSWA Ranga 系統性能和穩定性產生不良影響。請僅在十分清楚的情況下繼續操作。",
"<br><br>Your connection to this site is not a private connection. This means that your data is transmitted over the Internet without encryption, which can cause the extension to be maliciously replaced.":"<br><br>您與此站點的連線不是私密連線。這意味著你的資料未經加密在網際網路上傳輸，這可能導致擴充套件程式被惡意替換。",
"To install the extension, you must be authenticated\n\nEnter the superuser password to continue":"若要安裝擴充套件程式，您必須經過認證\n\n輸入超級使用者密碼繼續",
"Installing extension":"正在安裝擴充套件程式",
"<b>Installation is complete, please manually reload the web console</b>":"<b>安裝完畢，請手動重新整理 Web 控制檯</b>",
"Software change in progress":"正在執行軟體變更",
"Seth data has been configured for this interface. This data claims that it can be valid from \"{0}\" to \"{1}\".":"此介面已配置 Seth 資料。此資料聲稱它可以在 \"{0}\" 到 \"{1}\" 內有效。",
"This interface does not have Seth data configured, or missing metadata. This may be because your browser has deleted the relevant data.":"此介面未配置 Seth 資料，或缺失元資料，這可能是你的瀏覽器刪除了相關資料。",
"Unable to set Seth data, please make sure your browser supports IndexedDB":"無法設定 Seth 資料，請確保你的瀏覽器支援 IndexedDB",
"Select the interface you want to configure, or click the upper right button to add a new interface.":"選擇你要配置的介面，或者點選右上方按鈕新增新的介面。",
"Add":"新增",
"Add new interface":"新增新的介面",
"Please enter the name of the new interface, which must start with 'md'.":"請輸入新介面的名字，必須以 'md' 開頭。",
"The protocol type configuration for interface '{0}' has been modified.":"介面 ‘{0}' 的協議型別配置已經被修改。",
"Seth data has been updated":"Seth 資料已經更新",
"Load From Seth Server":"從 Seth 伺服器載入",
"Enter the secret code (Secret).":"輸入祕密程式碼（Secret）。",
"Load":"載入",
"Empty code is not supported.":"空的程式碼不被支援。",
"Downloading Seth data...":"正在下載 Seth 資料...",
"Download failed, your secret code (Secret) is incorrect, or you have a problem with your Internet connection.":"下載失敗，你的祕密程式碼（Secret）不正確，或者你的網路連線有問題。",
"The authentication configuration for interface '{0}' has been modified.":"介面 ‘{0}' 的認證資訊配置已經被修改。",
"The static address configuration for interface '{0}' has been modified.":"介面 ‘{0}' 的靜態地址配置已經被修改。",
"The physical address configuration for interface ‘{0}' has been modified.":"介面 ‘{0}' 的實體地址配置已經被修改。",
"The Reverse VLAN configuration for interface '{0}' has been modified.":"介面 ‘{0}' 的 Reverse VLAN 配置已經被修改。",
"The interface '{0}' has been deleted.":"介面 ‘{0}' 已經被刪除。",
"Connecting, please wait...":"正在連線，請稍候...",
"Interface '{0}' connected.":"介面 '{0}' 已連線。",
"Disconnected connection of interface '{0}'":"已斷開介面 '{0}' 的連線。",
"Catching server startup ({0})":"'攔截伺服器啟動中 ({0})",
"Catching server is already ready ({0})":"攔截伺服器已經準備就緒 ({0})",
"Catching server has Captured authentication information ({0})":"攔截伺服器已捕獲認證資訊 ({0})",
"The catching process for interface '{0}' has completed.":"介面 '{0}' 的攔截過程已經結束。",
"Catching server timed out ({0})":"攔截伺服器已超時 ({0})",
"Unable to get current NK PIN and Hash from Seth data. Please make sure the data has not expired and the current time is correct.":"無法從 Seth 資料中獲取當前 NK PIN 和 Hash，請確定資料未過期，且當前時間正確。",
"PPPoE（Netkeeper）":"基於乙太網的點對點協議 (Netkeeper)",
"PPPoE":"基於乙太網的點對點協議",
"DHCP":"動態主機配置協議",
"Unmanaged":"非託管",
"Static":"靜態",
"TX bytes: ":"已傳送：",
"RX bytes: ":"已接收：",
"Reload":"重新整理",
"Seth Safe disconnect":"Seth 安全斷開",
"Dialing doctor":"撥號醫生",
"Please note: <b>Directly running the dialing doctor may report a completely erroneous diagnosis</b>. When the connection (except the catching method) failed, the dialing doctor will automatically pop up a notification to start, and the result is higher. However, you can still force the dialing doctor to diagnose the catching method or the last automatic dialing problem at any time, but the result may be inaccurate or even completely wrong.":"請注意：<b>直接執行撥號醫生可能報告完全錯誤的診斷結果</b>，在連線（攔截法除外）失敗時，撥號醫生會自動彈出通知以啟動，這時的結果正確率較高。但你仍然可以隨時強制啟動撥號醫生，以診斷攔截法或上次自動撥號的連線問題，但結果可能不準確甚至完全錯誤。",
"I know":"我知道了",
"Start catching for all NK interfaces":"為所有 NK 介面啟動攔截",
"Getting interface information...":"正在獲取介面資訊...",
"Extra tools":"額外工具",
"Ranga software version":"Ranga 軟體版本",
"System version: {0}":"系統版本：{0}",
"Kernel version: {0}":"核心版本：{0}",
"System update release site":"系統更新發布站點",
"Device Information":"裝置資訊",
"Architecture: {0}":"架構：{0}",
"Chip: {0}":"晶片：{0}",
"Board: {0}":"板子：{0}",
"Model name: {0}":"模型名稱：{0}",
"Resource usage":"資源使用",
"Total memory: {0} KB":"總記憶體：{0}",
"Memory (used): {0} KB":"記憶體（已使用）：{0} 千位元組",
"Memory (cached): {0} KB":"記憶體（已快取）：{0} 千位元組",
"Memory (buffered): {0} KB":"記憶體（已緩衝）：{0} 千位元組",
"Memory (shared): {0} KB":"記憶體（共享）：{0} 千位元組",
"Storage: {0}":"儲存：{0}",
"System uptime: {0}":"系統執行時間：{0}",
"Ranga System Legal Information":"Ranga 系統法律資訊",
"Open source license":"開放原始碼許可",
"Ranga End User License Agreement":"Ranga 終端使用者許可協議",
"Web console legal information":"Web 控制檯法律資訊",
"Web console license agreement":"Web 控制檯授權協議",
"Font Awesome Icon Creation Common License":"Font Awesome 圖示創作共用許可",
"Google Material.io icon license":"Google Material.io 圖示許可",
"Add binding":"新增繫結",
"Enter IPv4 Address":"輸入網際網協議版本4地址",
"Enter MAC Address":"輸入媒體訪問控制地址",
"Purge all bindings":"清除全部繫結",
"Are you sure you want to purge all bindings?":"確定要清除全部繫結嗎？",
"Purge":"清除",
"Add an upstream DNS server":"新增上游域名系統伺服器",
"Enter the IPv4 address of upstream DNS server":"輸入上游域名系統伺服器網際網協議版本4地址",
"The DHCP configuration has changed. However, you need to restart the DHCP Service to take effect.":"動態主機配置協議配置已經更改。但需要重啟動態主機配置服務以生效。",
"The DNS configuration has changed. However, you need to restart the DNS service to take effect.":"域名系統配置已經更改。但需要重啟域名系統服務以生效。",
"Auto":"自動",
"Please be patient and wait for the wireless reboot to complete, this should not take too long, but the web console will not automatically refresh.":"請耐心等待無線重啟完畢，這應該不需要太長時間，但是 Web 控制檯不會自動重新整理。",
"Quick Setup":"快速設定",
"The wireless security for wireless device ‘{0}' has been modified. However, you need to restart the wireless service to take effect.":"無線裝置 ‘{0}' 的無線安全設定已經被修改。但需要重啟無線服務以生效。",
"The pre-shared key for wireless device ‘{0}' has been modified. However, you need to restart the wireless service to take effect.":"無線裝置 ‘{0}' 的預共享金鑰已經被修改。但需要重啟無線服務以生效。",
"The radio configuration of the wireless device '{0}' has been modified. However, you need to restart the wireless service to take effect.":"無線裝置 ‘{0}' 的無線電配置已經被修改。但需要重啟無線服務以生效。",
"Please select a file":"請選擇一個檔案",
"CLI Tools":"命令列工具",
"Select the wireless device you want to configure":"選擇你要配置的無線裝置",
"Please choose":"請選擇",
"Modifications to the wireless settings will not take effect until the NSWA Ranga system is rebooted or the wireless service is restarted. So after modifying these settings, you can click the \"Restart Wireless Service\" button to take effect immediately. This operation takes a little while to complete, you don't have to modify each configuration to execute, you can complete multiple configurations of multiple wireless devices and then execute it once.":"無線設定的修改在重啟 NSWA Ranga 系統或重啟無線服務之前不會生效。因此在修改這些設定後，你可以點按 “重啟無線服務” 按鈕使其立即生效。此操作需要一點時間完成，你不必修改每個配置後執行，你可以完成多個無線裝置的多個配置，然後執行一次。",
"Restart Wireless Service":"重啟無線服務",
"Wireless device status":"無線裝置狀態",
"Wireless security":"無線安全",
"WPA3 SAE":"Wi-Fi 保護訪問 3 等時同等認證",
"WPA3 SAE, WPA2 PSK Mixed mode":"Wi-Fi 保護訪問 3 等時同等認證、Wi-Fi 保護訪問 2 預共享金鑰混合模式",
"WPA2 PSK (CCMP)":"Wi-Fi 保護訪問 2 預共享金鑰（具有 CBC-MAC 計數器協議）",
"WPA2 PSK (TKIP)":"Wi-Fi 保護訪問 2 預共享金鑰（臨時金鑰完整性協議）",
"WPA2 PSK (Double protocol)":"Wi-Fi 保護訪問 2 預共享金鑰（雙協議）",
"WPA2 and WPA PSK Mixed mode (Double protocol)":"Wi-Fi 保護訪問 2、Wi-Fi 保護訪問預共享金鑰混合模式（雙協議）",
"WPA PSK (CCMP)":"Wi-Fi 保護訪問預共享金鑰（具有 CBC-MAC 計數器協議）",
"WPA PSK (TKIP)":"Wi-Fi 保護訪問預共享金鑰（臨時金鑰完整性協議）",
"Open (non-authenticate)":"開放（不進行身份驗證）",
"Apply":"應用",
"NSWA Ranga may not currently support the Wi-Fi Protected Access 3 (WPA3) series of suits.":"NSWA Ranga 可能暫時不支援 “Wi-Fi 保護訪問 3” 系列的套件。",
"Pre-shared key":"預共享金鑰",
"When using the \"PSK\", use the following pre-shared key for authentication. When the key is less than 8 digits, NSWA Ranga automatically disables the wireless device, which is a common way to disable one or all of the wireless devices on NSWA Ranga.":"當使用 “預共享金鑰” 時，使用下面的預共享金鑰進行認證。金鑰少於 8 位時，NSWA Ranga 會自動禁用此無線裝置，這是在 NSWA Ranga 上禁用某個或全部無線裝置的通用方法。",
"SSID":"服務集識別符號",
"Key":"金鑰",
"Radio configuration":"無線電配置",
"Some settings, such as RTS Threshold, Distance Optimization, and Radio Power are temporarily not supported by the web console, use the command line tool instead. The area code uses the ISO/IEC 3166-1 alpha-2 standard, common area codes: 00 - World, CN - China, US - USA, TW - Taiwan, AU - Australia. The area code will affect the wireless regulatory domain, affecting the channel that the driver can choose, the maximum radio power, modulation, etc. Please use this function in compliance with local radio regulations. Some devices hardcode the maximum radio power or other parameters in the device, even if you set other area codes. The blank area code will cause a fallback to the driver default, which may be the \"world\" regulatory domain.":"某些設定，如 “RTS 閾值”、“距離優化”、“無線電功率” 暫時不支援由 Web 控制檯設定，請使用命令列工具。地區程式碼使用 ISO/IEC 3166-1 alpha-2 標準，常見地區程式碼：00 - 世界，CN - 中國，US - 美國，TW - 臺灣，AU - 澳洲。地區程式碼將影響無線監管域，從而影響驅動程式能選擇的通道、最大無線電功率、調製方式等，請在遵守當地無線電管制條例的前提下使用此功能。有些裝置在裝置中硬編碼了最大無線電功率或其他引數，即使你設定其他地區程式碼也無法繞過。置空地區程式碼將導致回退到驅動程式預設值，可能是 “世界” 監管域。",
"Area code":"地區程式碼",
"Channel":"通道",
"Throughput mode (HT)":"吞吐量模式（頻寬）",
"Disable overlapping set scanning":"禁用重疊服務集掃描",
"Enabled (this will violate IEEE 802.11n-2009)":"啟用（這將違反 IEEE 802.11n-2009）",
"Some devices support the installation of vendor-specific drivers that may not use some of the settings on this wireless setup page.":"某些裝置支援安裝供應商專有驅動程式，這些專有驅動程式可能不使用此無線設定頁的部分設定。",
"Automatically add a frequency suffix after the access point SSID":"為接入點服務集識別符號後自動新增頻率後戳",
"Modifications to the Domain Name System and Dynamic Host Configuration settings will not take effect until the NSWA Ranga system is restarted or the Domain Name System and Dynamic Host Configuration Service are restarted. So after modifying these settings, you can click the \"Restart DNS and DHCP Service\" button to take effect immediately. This operation takes a little while to complete, you don't have to modify each configuration to execute, you can complete multiple configurations of multiple wireless devices and then execute it once.":"域名系統和動態主機配置設定的修改在重啟 NSWA Ranga 系統或重啟域名系統和動態主機配置服務之前不會生效。因此在修改這些設定後，你可以點按“重啟域名系統和動態主機配置服務”按鈕使其立即生效。此操作需要一點時間完成，你不必修改每個配置後執行，你可以完成多個無線裝置的多個配置，然後執行一次。",
"Restart DNS and DHCP Service":"重啟域名系統和動態主機配置服務",
"IPv4 Address - MAC Address Binding":"網際網協議版本4地址-媒體訪問控制地址繫結",
"When the client requests the IPv4 address through the DHCP, NSWA Ranga will respond according to the client's MAC address and select the specified IPv4 address. However, the Ethernet client can still set its own IPv4 address at will.":"客戶端通過“動態主機配置協議”請求網際網協議版本4地址時，NSWA Ranga 將根據客戶端的媒體訪問控制地址選擇指定的網際網協議版本4地址進行應答。然而，在乙太網的客戶端仍然可以隨意設定自己的網際網協議版本4地址。",
"Add a new binding":"新增新的繫結",
"DHCP configuration":"動態主機配置協議配置",
"If the client cannot obtain the IPv4 address to access NSWA Ranga due to configuration reasons, you can set the client to the IPv4 address of the same subnetwork to resume access.":"如果因為配置原因導致客戶端無法獲取網際網協議版本4地址訪問 NSWA Ranga，你可以將客戶端設定為同一子網的網際網協議版本4地址恢復訪問。",
"Lease":"租期",
"Assign address offset (Version 4)":"分配地址偏移（版本4）",
"Assign address restrictions (version 4)":"分配地址限制（版本4）",
"Upstream DNS Server":"上游域名系統伺服器",
"Add a new server":"新增新伺服器",
"DNS Cache Server":"域名系統快取伺服器",
"Use the server provided by the peer":"使用對端提供的伺服器",
"Enable":"使能",
"Rebind attack protection":"Rebind 攻擊保護",
"Bind port":"繫結埠",
"Query port":"查詢埠",
"The configuration of some interfaces (such as authentication information) will take effect the next time you connect. However, some settings, such as \"Protocol Type\", \"Static Address\", \"Interface Physical Address\", etc. will not take effect until the NSWA Ranga system is restarted or the network service is restarted. So after modifying these settings, you can click the \"Restart Network Service\" button to take effect immediately. This operation takes a little while to complete. You don't have to modify each configuration to execute, you can complete multiple configurations of multiple interfaces and then execute it once. The established peer-to-peer protocol connection will be disconnected after restarting the network service.":"某些介面的配置（如認證資訊）在下次連線時即可生效。但有些設定，如“協議型別”、“靜態地址”、“介面實體地址”等在重啟 NSWA Ranga 系統或重啟網路服務之前不會生效。因此在修改這些設定後，你可以點按“重啟網路服務”按鈕使其立即生效。此操作需要一點時間完成。你不必修改每個配置後執行，你可以完成多項介面的多個配置，然後執行一次。重啟網路服務後已建立的點對點協議連線會斷開。",
"Restart Network Service":"重啟網路服務",
"Protocol Type":"協議型別",
"The Protocol Type is what network layer protocol to run on this interface. Netkeeper extensions are only valid when using a peer-to-peer protocol (for example, \"PPPoE\" and \"PPPoATM\")":"協議型別是要在此介面上執行什麼網路層協議。Netkeeper 擴充套件只有使用點對點協議時才會有效（例如”基於乙太網的點對點協議“和”基於 ATM 的點對點協議“）",
"Protocol":"協議",
"DHCPv6":"動態主機配置協議版本6",
"Static Address":"靜態地址",
"PPPoATM":"基於 ATM 的點對點協議",
"Netkeeper Extension":"Netkeeper 擴充套件",
"Non-enable":"非使能",
"Seth Data":"Seth 資料",
"<b>Only if you have \"Netkeeper Extension\" enabled</b>. The web console supports storing Seth data in your browser IndexedDB. Once you have set the Seth data, you can connect to this network using the \"Seth Connect\" method on your current browser. You can load Seth data directly from a file or from a Seth server. To update data from the Seth server, you must enter a secret code (Secret).":"<b>僅在你啟用了\"Netkeeper 擴充套件\"的情況下才有效</b>。Web 控制檯支援將 Seth 資料儲存到你的瀏覽器 IndexedDB 中，當你設定 Seth 資料後，你可以在當前瀏覽器上使用\"Seth 連線\"方式連線到此網路。你可以直接從檔案或者從 Seth 伺服器載入 Seth 資料。若要從 Seth 伺服器更新資料，你必須輸入祕密程式碼（Secret）。",
"Load From File":"從檔案載入",
"Authenticate":"認證",
"When the selected protocol has an authentication extension, the following authentication information is used for authentication. Such as PAP or CHAP of the PPPoE, 802.1X security, etc.":"當選定的協議存在認證擴充套件時，使用下面的認證資訊進行認證。例如點對點協議的密碼身份驗證協議和挑戰握手認證協議、802.1X 安全性等。",
"Username":"使用者名稱",
"Password":"密碼",
"When the selected protocol is \"Static Address\", use the following address configuration. But the Default Route configuration is always used.":"當選定的協議為“靜態地址”時，使用下面的地址配置。但是預設路由配置總是被使用。",
"IPv4 Address":"網際網協議版本4地址",
"IPv4 Netmask":"網際網協議版本4子網掩碼",
"IPv4 Nexthop":"網際網協議版本4下一跳",
"Default Route":"預設路由",
"Set this interface as the default entry for the routing table":"將此介面設定為路由表預設條目",
"The WAN port is an abstract concept. It is a real interface on some devices, and it is just a VLAN of a switch on some other devices. The interfaces ‘netkeeper’ and ‘wan’ are both bound to the WAN socket and the interface beginning with 'md' will be bound to a Reverse VLAN. Reverse VLAN is a concept defined by NSWA Ranga. Please refer to the detailed explanation in Multihoming. \"Reverse VLAN\" starts at 0.":"WAN 口是一個抽象概念。它在某些裝置上是一個真實的介面，在另外一些裝置上只是一個交換機的某個 VLAN。介面 ‘netkeeper’ 和 ‘wan’ 都繫結到 WAN 口上，以 'md' 開頭的介面將繫結到某個 Reverse VLAN 上。Reverse VLAN（反向 VLAN）是 NSWA Ranga 定義的概念，請參考“多宿主”中的詳細解釋。“反向 VLAN” 從 0 開始。",
"Interface Physical Address":"介面實體地址",
"For Ethernet devices, it is Media Access Control Address (MAC address).":"對於乙太網裝置，指媒體訪問控制地址（MAC地址）。",
"Physical Address:":"實體地址:",
"Delete Interface":"刪除介面",
"This interface and the configuration of this interface will be completely removed, and this operation is irrevocable.":"此介面和此介面的配置將完全被刪除，此操作不可撤銷。",
"Some interfaces are configured to couple with the system infrastructure, so you cannot modify some of their configurations. For example, the protocol type of the netkeeper interface must be PPPoE and the Netkeeper Extension must be turned on. And you cannot modify it to other protocols. For example, if you need the universal PPPoE protocol, you can modify the Protocol Type of the wan interface to PPPoE.":"某些介面的配置與系統基礎設施耦合，因此您不能修改其某些配置。例如，netkeeper 介面的協議型別必須是基於乙太網的點對點協議且必須開啟 Netkeeper 擴充套件。您不能修改為其他協議。舉例說明，假如你需要通用 PPPoE 協議，可以修改 wan 介面的協議型別為基於乙太網的點對點協議。",
"Update system by NSWA Online push":"使用 NSWA Online 推送更新系統",
"If you don't have the NSWA Online push feature turned off in the web console, the new version will be pushed to you when you open the web console. An update notification will pop up.":"如果你沒有關閉 Web 控制檯的 NSWA Online 推送功能，新版本釋出後，在你開啟 Web 控制檯時會向你推送。彈出更新通知。",
"Use the command line tool to update your system to the latest version":"使用命令列工具更新系統到最新版本",
"Use the command line tool to automatically update the NSWA Ranga system to the latest version, which is useful when you need to install multiple OTA updates. In most cases, this command allows the NSWA Ranga system to automatically install all OTA update packages from the current version to the latest version.":"使用命令列工具可以自動將 NSWA Ranga 系統更新到最新版本，這在需要安裝多個 OTA 更新的時候非常有用。大部分情況下，使用此命令可以將 NSWA Ranga 系統自動安裝從當前版本直到最新版本所有的 OTA 更新包。",
"If you need to install a firmware file using the command line tool, you can":"如果需要使用命令列工具安裝一個韌體檔案，你可以",
"For more usage of the command line tool for system updates, run<code>ranga-cli swdeploy -h</code>for help.":"有關命令列工具進行系統更新的更多用法，請執行<code>ranga-cli swdeploy -h</code>獲得幫助資訊。",
"Upload firmware using the web console":"使用 Web 控制檯上傳韌體",
"Uploading system firmware updates via the web console is experimental and your browser must be new enough to support the File API, which is currently just a web working draft. \"Erase the current system configuration during the next full package update\" will remain in effect until you (actively or passively) reboot the system; \"Politely requesting a reboot after installation\" is not a mandatory operation, but rather making a request to the updater, which can be ignored by the updater. At the same time, the updater may decide whether it should do reboot or not, regardless of whether you request it or not. However, for most updates that do not need to be restarted, this feature will be restarted after the update is complete.":"通過 Web 控制檯上傳系統韌體更新是具有實驗性的，且你的瀏覽器必須足夠新以支援目前僅僅是 Web 工作草案的 File API。\"下次完整包更新時抹掉當前系統配置\" 會在你（主動或被動）重啟系統之前一直有效；\"禮貌地要求安裝完畢後執行重啟\" 並非一個強制性的操作，而是向更新程式提出請求，可以被更新程式忽略，同時，更新程式也可能自行決定是否應該重啟，而不管你是否請求，但是，對於大部分無需重啟的更新，使用此功能將會在更新完畢後重啟。",
"Select the firmware file:":"選擇韌體檔案：",
"Erase the current system configuration during the next full package update":"下次完整包更新時抹掉當前系統配置",
"Politely requesting a reboot after installation":"禮貌地要求安裝完畢後執行重啟",
"Upload":"上傳",
"Web console version:":"Web 控制檯版本：",
"Get the web console source code":"獲取 Web 控制檯原始碼",
"Contributor list":"貢獻者列表",
"Connect":"連線",
"Seth Connect":"Seth 連線",
"Start catching":"啟動攔截",
"Disconnect":"斷開",
"Traditional catching server is disabled because the new persistent catching service is enabled.":"由於新型持續性攔截服務已經啟用，傳統攔截伺服器被禁用。",
};
