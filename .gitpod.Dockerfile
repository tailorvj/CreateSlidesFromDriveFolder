FROM node:20

# Install global npm packages
RUN npm install -g @google/clasp
RUN npm install -g eslint

# Set the working directory
WORKDIR /workspace

# Add the "node" user to sudoers
RUN adduser node sudo
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Switch back to the "node" user
USER node