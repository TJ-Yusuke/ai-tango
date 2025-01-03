import AppTopPage from "@/components/screens/appTopPage/appTopPage";
import { PaperProvider } from "react-native-paper";

export default function Index() {
  return (
    <PaperProvider>
      <AppTopPage />
    </PaperProvider>
  );
}
