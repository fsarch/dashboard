'use client';

import React from 'react';
import { TScoreCalculationResultDto } from '@/services/watchtower/watchtower.type';

type ScopeScoreDisplayProps = {
  scoreResult: TScoreCalculationResultDto;
};

const ScopeScoreDisplay: React.FunctionComponent<ScopeScoreDisplayProps> = ({ scoreResult }) => {
  const { scopeScores, finalRisk } = scoreResult;

  // Find the scope score (there should be only one since we're calculating for a single scope)
  const scopeScore = scopeScores[0];

  if (!scopeScore) {
    return <p>Keine Score-Daten verfügbar.</p>;
  }

  return (
    <div>
      <h4>Score Berechnung</h4>
      <table>
        <tbody>
          <tr>
            <th>Final Risk</th>
            <td>{finalRisk.toFixed(4)}</td>
          </tr>
          <tr>
            <th>Scope Risk</th>
            <td>{scopeScore.scopeRisk.toFixed(4)}</td>
          </tr>
          <tr>
            <th>Weighted Scope</th>
            <td>{scopeScore.weightedScope.toFixed(4)}</td>
          </tr>
        </tbody>
      </table>
      
      {scopeScore.eventTypeScores.length > 0 && (
        <>
          <h4>Event Type Scores</h4>
          <table>
            <thead>
              <tr>
                <th>Event Type ID</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {scopeScore.eventTypeScores.map((eventTypeScore) => (
                <tr key={eventTypeScore.eventTypeId}>
                  <td>{eventTypeScore.eventTypeId}</td>
                  <td>{eventTypeScore.score.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ScopeScoreDisplay;
