import { useEffect } from "react";
import { useNavigate } from "react-router";
import { TabWidget } from "./TabWidget";

export function Root() {
  const navigate = useNavigate();

  useEffect(() => {
    // 이전 QuickTask URL이 남아있는 경우 홈으로 리다이렉트
    if (window.location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-200 rounded-full blur-3xl" />
      </div>

      {/* Minimalist branding - optional */}
      <div className="absolute top-8 left-8 z-10">
        <h1 className="text-2xl font-light text-slate-400">QuickTask</h1>
        <p className="text-xs text-slate-300 mt-1">업무 서랍</p>
      </div>

      {/* Tab Widget - The main feature */}
      <TabWidget />
    </div>
  );
}