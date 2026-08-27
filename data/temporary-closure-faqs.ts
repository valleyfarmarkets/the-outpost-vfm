export interface TemporaryClosureFaq {
  readonly question: string;
  readonly answer: string;
  readonly link?: {
    readonly text: string;
    readonly href: string;
  };
}

export const temporaryClosureFaqs = [
  {
    question: "When will The Outpost reopen?",
    answer:
      "We do not currently have a confirmed reopening date. Our team is actively working through the required improvements and approval process, and we will reopen as soon as we are able to do so.",
  },
  {
    question: "Why is The Outpost temporarily closed?",
    answer:
      "The Outpost is temporarily closed while we address required facility and septic system improvements. We are working with the appropriate parties to complete the necessary work and approvals.",
  },
  {
    question: "Can I make a reservation for a future date?",
    answer:
      "We are not currently accepting reservations while the restaurant is closed. Reservations will reopen once we have a confirmed reopening date.",
  },
  {
    question: "Where can I find reopening updates?",
    answer:
      "We will share updates on our website and social media channels as soon as we have confirmed information to announce.",
  },
  {
    question: "Are the cabins still available?",
    answer:
      "The restaurant closure does not necessarily affect other Outpost operations. Please check current availability or contact us with questions regarding cabin reservations.",
    link: {
      text: "check current availability",
      href: "/cabins",
    },
  },
  {
    question: "Should I contact you to ask about the reopening date?",
    answer:
      "There is no additional reopening information available beyond what is posted here. We appreciate your patience and recommend checking this page or our social channels for the latest updates.",
  },
] as const satisfies readonly TemporaryClosureFaq[];
