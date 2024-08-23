# Block Sign

**Block Sign** is a decentralized application (dApp) that enables users to digitally sign PDF documents using Internet Computer (ICP) identity. The application leverages the unique capabilities of the Internet Computer to ensure secure, verifiable, and tamper-proof digital signatures, enhancing the trust and integrity of document exchanges.

## Project Overview

Block Sign is designed to offer a seamless experience for users to sign documents digitally, ensuring that the signatures are cryptographically secure and verifiable on-chain. By using ICP identity, Block Sign ensures that each signature is tied to a verified identity, adding an additional layer of trust.

### Key Features

- **ICP Identity Integration**: Users authenticate and sign documents using their ICP identity, ensuring that signatures are both secure and verifiable.
- **Decentralized Storage**: Signed documents are stored on the Internet Computer, ensuring availability and tamper-proof storage.
- **Cross-Platform Accessibility**: Accessible from any device with an internet connection, allowing users to sign documents from anywhere.
- **Verifiable Signatures**: Every signature is recorded on-chain, making it easy to verify the authenticity of signed documents.

## Getting Started

### Prerequisites

Ensure that you have the following installed:

- [Node.js](https://nodejs.org/en/) `>= 16`
- [dfx](https://internetcomputer.org/docs/current/developer-docs/build/install-upgrade-remove) `>= 0.14`
- [Rust](https://www.rust-lang.org/tools/install) (if developing backend in Rust)
- [Motoko](https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/motoko/) (if developing backend in Motoko)

### Installation

Clone the repository:

```bash
git clone https://github.com/ersaazis/BlockSign.git
cd BlockSign
```

Install dependencies:

```bash
npm install
```

Start the local dfx environment:

```bash
dfx start --clean --background
```

Deploy the canisters:

```bash
dfx deploy
```

Run the development server:

```bash
npm start
```

### Usage

1. **Authenticate**: Users log in using their ICP identity.
2. **Upload Document**: Users can upload a PDF document they wish to sign.
3. **Sign Document**: Users can apply their digital signature to the document.
4. **Verify Signature**: Anyone can verify the authenticity of the signed document by checking the on-chain record.

## Technology Stack

- **Frontend**: TypeScript, React, Tailwind CSS
- **Backend**: Motoko/Rust on Internet Computer
- **Authentication**: ICP Identity
- **Storage**: Internet Computer Canisters

## Project Submission

This project was submitted as part of the 2024 Chain Fusion Hacker House Bali. The submission includes:

- A link to the GitHub repository with the complete codebase.
- A live demo hosted on the Internet Computer mainnet: [Block Sign Demo](https://your-canister-id.raw.icp0.io)
- A video demonstration showcasing the key features and usage.
- A detailed description of the project, team participants, and the chosen track.

## Challenges & Learnings

### What We Learned

- Deepened understanding of ICP identity and its integration with decentralized applications.
- Gained experience in building cross-platform, user-friendly interfaces for blockchain-based applications.

### Challenges Faced

- Ensuring the security and integrity of the digital signatures.
- Integrating ICP identity in a way that is both seamless for users and robust against potential security threats.

### Achievements

- Successfully developed a fully functional dApp that provides a real-world solution for digital signatures.
- Leveraged the unique features of the Internet Computer to enhance the security and accessibility of the application.

## Team Participants

- [ersaazis](https://github.com/ersaazis)
- [andynur](https://github.com/andynur)
- [diwanmuhamad](https://github.com/diwanmuhamad)
