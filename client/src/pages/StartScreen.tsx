import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParkingContext } from "@/contexts/ParkingContext";

const StartScreen: React.FC = () => {
  const { startSelection } = useParkingContext();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-secondary">
      <div className="max-w-4xl w-full mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 whitespace-nowrap">
            台北雪梨灣社區機車停車位選號系統
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            為您的社區自動分配機車停車位
          </p>

          {/* Image Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* 機車圖示 */}
            <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg overflow-hidden border border-blue-200">
              <svg
                className="w-full h-full text-blue-600 p-8"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 機車車身 */}
                <rect x="25" y="35" width="50" height="15" rx="7" fill="currentColor"/>
                {/* 前輪 */}
                <circle cx="20" cy="65" r="12" stroke="currentColor" strokeWidth="3" fill="none"/>
                <circle cx="20" cy="65" r="6" fill="currentColor"/>
                {/* 後輪 */}
                <circle cx="80" cy="65" r="12" stroke="currentColor" strokeWidth="3" fill="none"/>
                <circle cx="80" cy="65" r="6" fill="currentColor"/>
                {/* 把手 */}
                <path d="M25 35 L15 25 M25 35 L35 25" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                {/* 車座 */}
                <rect x="55" y="25" width="20" height="8" rx="4" fill="currentColor"/>
                {/* 連接部分 */}
                <line x1="20" y1="53" x2="20" y2="65" stroke="currentColor" strokeWidth="3"/>
                <line x1="80" y1="53" x2="80" y2="65" stroke="currentColor" strokeWidth="3"/>
                <line x1="32" y1="50" x2="68" y2="50" stroke="currentColor" strokeWidth="3"/>
              </svg>
            </div>

            {/* 停車場圖示 */}
            <div className="w-full h-48 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg overflow-hidden border border-green-200">
              <svg
                className="w-full h-full text-green-600 p-6"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 建築物外框 */}
                <rect x="10" y="20" width="80" height="60" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                {/* 屋頂 */}
                <path d="M5 20 L50 5 L95 20" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2"/>
                {/* 停車格線 */}
                <line x1="25" y1="30" x2="25" y2="70" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="40" y1="30" x2="40" y2="70" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="55" y1="30" x2="55" y2="70" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="70" y1="30" x2="70" y2="70" stroke="currentColor" strokeWidth="1.5"/>
                {/* 停車位標記 */}
                <text x="17" y="55" fontSize="8" fill="currentColor" textAnchor="middle">P</text>
                <text x="32" y="55" fontSize="8" fill="currentColor" textAnchor="middle">P</text>
                <text x="47" y="55" fontSize="8" fill="currentColor" textAnchor="middle">P</text>
                <text x="62" y="55" fontSize="8" fill="currentColor" textAnchor="middle">P</text>
                <text x="77" y="55" fontSize="8" fill="currentColor" textAnchor="middle">P</text>
                {/* 入口 */}
                <rect x="42" y="75" width="16" height="5" fill="currentColor"/>
              </svg>
            </div>

            {/* 抽籤箱圖示 */}
            <div className="w-full h-48 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg overflow-hidden border border-orange-200">
              <svg
                className="w-full h-full text-orange-600 p-8"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 抽籤箱 */}
                <rect x="20" y="40" width="60" height="45" rx="5" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.1"/>
                {/* 箱蓋 */}
                <ellipse cx="50" cy="40" rx="30" ry="8" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.2"/>
                {/* 投入口 */}
                <rect x="40" y="25" width="20" height="15" rx="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                {/* 抽籤紙片飛出效果 */}
                <rect x="65" y="15" width="8" height="12" rx="2" fill="currentColor" transform="rotate(15 69 21)"/>
                <rect x="75" y="10" width="6" height="9" rx="1.5" fill="currentColor" fillOpacity="0.7" transform="rotate(25 78 14.5)"/>
                <rect x="15" y="20" width="7" height="10" rx="1.5" fill="currentColor" fillOpacity="0.8" transform="rotate(-20 18.5 25)"/>
                {/* 手柄 */}
                <circle cx="75" cy="55" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="75" y1="51" x2="75" y2="45" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
          </div>
        </div>

        <Card className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-left space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                📢【台北雪梨灣｜B2區C、D、E棟機車車位換位抽籤公告】
              </h2>
              <p className="text-lg text-blue-600 font-semibold mb-3">
                ⏰ 時間：7/25 19:00 線上直播
              </p>
              <p className="text-lg text-gray-700">
                🛵 本次機車格共計 39 格，將進行電腦抽籤作業。
              </p>
            </div>

            <p className="border-t pt-4 whitespace-pre-wrap">
              {`
📌 抽籤對象：限B2區 C、D、E棟住戶
📌 登記期限：即日起至 7月20日（日） 止
📌 登記地點：管理中心
📌 抽籤日期：7月25日（五）19:00
📌 抽籤地點：F棟一樓烹飪教室

📍開放抽籤車位如下（共39格）：

🔹 B3區（原自行車專區，供C、D 棟換抽）
　• 車位編號：82、143-1（共2格）

🔹 B2區（原自行車專區，供 C、D 、E棟換抽）
　• 車位編號：159、160、161、486、487（共5格）
　• 原編號338、339、340、408取消開放 ❌

🔹 B1區（供C、D、E棟換抽，計32格）：
　• 原訪客收費機車位 + 空格 + 自行車專區，車位編號如下：
498、515、518、519、520、521、528、529、530、532、533、536、540、545、549、552、559、561、565、570、578、583-1、585、588、593、600、602、603、609、618、572、573

📌 為保障公平原則，參與本次換抽者需同意放棄原有固定機車位，方可參加抽籤。
📌 如抽籤未中籤者，原有固定機車位將自動保留，原抽籤結果不受影響。
📌 抽中換抽新車位後，即視為放棄原先機車格，原車位將重新釋出或由管理中心另行分配，不得要求保留。
`}
            </p>
          </div>
        </Card>

        <Button
          onClick={startSelection}
          className="start-selection-btn text-2xl md:text-4xl font-bold py-6 px-12 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 h-auto"
        >
          開始選號
        </Button>
      </div>
    </div>
  );
};

export default StartScreen;
