{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

        backendDeps = with pkgs; [
        ];

        frontendDeps = with pkgs; [
          nodejs
          pnpm
        ];

      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = backendDeps ++ frontendDeps;
        };
      }
    );
}
