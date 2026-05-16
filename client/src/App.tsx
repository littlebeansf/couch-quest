import { useReducer, useCallback, useState } from "react";
import { Router, Switch, Route, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { SessionContext, sessionReducer } from "@/state/sessionStore";
import { GameSession } from "@/types/game";
import { Toaster } from "@/components/ui/toaster";

import HomeScreen from "@/pages/HomeScreen";
import SafetyScreen from "@/pages/SafetyScreen";
import CreateSessionScreen from "@/pages/CreateSessionScreen";
import PlayerSetupScreen from "@/pages/PlayerSetupScreen";
import CharacterSelectScreen from "@/pages/CharacterSelectScreen";
import MaterialsScreen from "@/pages/MaterialsScreen";
import GameScreen from "@/pages/GameScreen";
import RecapScreen from "@/pages/RecapScreen";
import NotFound from "@/pages/not-found";

export default function App() {
  const [session, dispatch] = useReducer(sessionReducer, null);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContext.Provider value={{ session, dispatch }}>
        <Router hook={useHashLocation}>
          <Switch>
            <Route path="/" component={HomeScreen} />
            <Route path="/safety" component={SafetyScreen} />
            <Route path="/create" component={CreateSessionScreen} />
            <Route path="/players" component={PlayerSetupScreen} />
            <Route path="/characters" component={CharacterSelectScreen} />
            <Route path="/materials" component={MaterialsScreen} />
            <Route path="/game" component={GameScreen} />
            <Route path="/recap" component={RecapScreen} />
            <Route component={NotFound} />
          </Switch>
        </Router>
        <Toaster />
      </SessionContext.Provider>
    </QueryClientProvider>
  );
}
