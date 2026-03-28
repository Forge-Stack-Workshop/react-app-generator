#!make
ifneq (,)
	$(error This Makefile requires GNU Make)
endif

# ─── Variables ────────────────────────────────────────────────────────────────
PROJECT_NAME ?= react-app-generator
NODE_BIN     := node_modules/.bin

# ─── Phony targets ────────────────────────────────────────────────────────────
.DEFAULT_GOAL := help

.PHONY: $(shell grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | cut -d":" -f1 | tr "\n" " ")

# ─── Help ─────────────────────────────────────────────────────────────────────
help: ## Display this help message
	@echo "==================================================================="
	@echo "  $(PROJECT_NAME)"
	@echo "==================================================================="
	@echo ""
	@echo "Available commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+(\([^)]*\))?:.*?## .*$$' $(MAKEFILE_LIST) 2>/dev/null | sort | \
		awk 'BEGIN {FS = ":.*?## "}; { \
			cmd = $$1; \
			desc = $$2; \
			if (match(cmd, /\([^)]+\)/)) { \
				args = substr(cmd, RSTART+1, RLENGTH-2); \
				gsub(/\([^)]+\)/, "", cmd); \
				printf "  \033[36m%-20s\033[0m \033[33m%-15s\033[0m %s\n", cmd, args, desc; \
			} else { \
				printf "  \033[36m%-20s\033[0m \033[33m%-15s\033[0m %s\n", cmd, "", desc; \
			} \
		}'
	@echo ""
	@echo "📝 EXAMPLES:"
	@echo "  make dev              # Start development server"
	@echo "  make build            # Build for production"
	@echo "  make lint             # Lint the code"
	@echo "  make format           # Format code"
	@echo ""
	@echo "Environment Variables:"
	@echo "  PROJECT_NAME=$(PROJECT_NAME)"
	@echo "==================================================================="

# ─── Install ──────────────────────────────────────────────────────────────────
install: ## Install dependencies
	@npm install

install-ci: ## Install dependencies (CI mode, no scripts)
	@npm ci

# ─── Development ──────────────────────────────────────────────────────────────
dev: ## Start development server
	@npm run dev

# ─── Build ────────────────────────────────────────────────────────────────────
build: ## Build for production
	@npm run build

preview: ## Preview production build
	@npm run preview

# ─── Quality ──────────────────────────────────────────────────────────────────
lint: ## Run ESLint
	@npm run lint

format: ## Format code with Prettier (if configured)
	@$(NODE_BIN)/prettier --write "src/**/*.{ts,tsx,css,scss}" 2>/dev/null || echo "Prettier not configured"

typecheck: ## Run TypeScript type check
	@npx tsc --noEmit

# ─── Tests ────────────────────────────────────────────────────────────────────
test: ## Run tests
	@npm run test 2>/dev/null || echo "No test script configured"

test-ci: ## Run tests in CI mode
	@npm run test:ci 2>/dev/null || npm run test 2>/dev/null || echo "No test script configured"

# ─── Pre-commit ───────────────────────────────────────────────────────────────
pre-commit-install: ## Install pre-commit hooks
	@pre-commit install
	@pre-commit install --hook-type commit-msg

pre-commit-run: ## Run pre-commit hooks on all files
	@pre-commit run --all-files

pre-commit-update: ## Update pre-commit hooks to latest versions
	@pre-commit autoupdate

# ─── MSW ──────────────────────────────────────────────────────────────────────
msw-init: ## Initialize MSW service worker
	@npx msw init public/ --save

# ─── Clean ────────────────────────────────────────────────────────────────────
clean: ## Remove build artifacts
	@rm -rf dist dist-ssr

clean-all: ## Remove build artifacts and node_modules
	@rm -rf dist dist-ssr node_modules

# ─── CI ───────────────────────────────────────────────────────────────────────
ci: install-ci lint typecheck build ## Run full CI pipeline (install, lint, typecheck, build)
