// Mock Automations
export const MOCK_AUTOMATIONS = [
    {
        id: "send_email",
        label: "Send Email",
        description: "Send an email notification to a recipient",
        params: [
            { name: "to", type: "email", label: "Recipient" },
            { name: "subject", type: "text", label: "Subject" },
            { name: "body", type: "textarea", label: "Message Body" }
        ]
    },
    {
        id: "generate_doc",
        label: "Generate Document",
        description: "Create a PDF from a template",
        params: [
            { name: "template", type: "select", label: "Template", options: ["Offer Letter", "NDA", "Contract"] },
            { name: "recipient", type: "text", label: "Recipient Name" }
        ]
    },
    {
        id: "slack_message",
        label: "Send Slack Message",
        description: "Post a message to a Slack channel",
        params: [
            { name: "channel", type: "text", label: "Channel ID" },
            { name: "message", type: "textarea", label: "Message" }
        ]
    }
];

// Mock Users/Roles for Assignment
export const MOCK_ROLES = ["Manager", "HRBP", "Director", "IT Admin"];
export const MOCK_USERS = ["Alice", "Bob", "Charlie", "Diana"];
