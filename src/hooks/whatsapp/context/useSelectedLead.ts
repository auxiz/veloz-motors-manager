
import { useState, useEffect } from 'react';
import { Lead } from '../types';

interface UseSelectedLeadProps {
  leads: Lead[];
  fetchMessages: (leadId: string) => Promise<void>;
  markMessagesAsRead: (leadId: string) => Promise<void>;
  setMessages: (messages: any[]) => void;
}

export const useSelectedLead = ({
  leads,
  fetchMessages,
  markMessagesAsRead,
  setMessages
}: UseSelectedLeadProps) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const selectLead = (lead: Lead | null) => {
    setSelectedLead(lead);
    if (lead) {
      fetchMessages(lead.id);
      markMessagesAsRead(lead.id);
    } else {
      setMessages([]);
    }
  };

  // Update selected lead if it exists in the new data after fetching leads
  useEffect(() => {
    if (selectedLead) {
      const updatedLead = leads.find((lead) => lead.id === selectedLead.id);
      if (updatedLead) {
        setSelectedLead(updatedLead);
      }
    }
  }, [leads, selectedLead]);

  return { selectedLead, selectLead };
};
