# 🎯 CS-001: Sistema de Cuotas - Plan de Implementación Detallado

> **Task**: CS-001 - Usage Quotas Implementation  
> **Estimate**: 8 horas  
> **Priority**: 🔥 Critical  

## 📋 Análisis del Estado Actual

### ✅ **Lo que YA tenemos:**
- **Database**: Campo `credits: Int @default(3)` en modelo User 
- **Wasp Framework**: Operaciones, queries, validación con Zod
- **Patrones establecidos**: `/src/user/operations.ts` como referencia
- **UI Components**: Shadcn/ui listos para usar
- **Error Handling**: Sistema de ServiceError con correlación IDs

### 🎯 **Lo que necesitamos implementar:**
1. **Tracking de consumo** de APIs por operación
2. **Validación de quotas** antes de operaciones costosas  
3. **Operaciones CRUD** para gestión de créditos
4. **UI Components** para mostrar créditos restantes
5. **Tests unitarios** para el sistema de créditos

---

## 🏗️ Plan de Implementación Optimizado

### **Paso 1: Database Schema (15 min)**
**Ya está listo** ✅ - El campo `credits` existe en User model.

**Verificación opcional**: Añadir índice si es necesario
```prisma
// En schema.prisma - OPCIONAL (solo si vemos performance issues)
model User {
  // ... existing fields
  credits Int @default(3)
  
  @@index([credits]) // OPCIONAL - solo si necesitamos queries por credits
}
```

### **Paso 2: Credit Service Core (2 horas)**

#### **File**: `src/credit/operations.ts` (NUEVO)
```typescript
// Operaciones básicas siguiendo patrón de user/operations.ts
import { type User } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import * as z from 'zod';

// 1. getUserCredits - Query para obtener créditos actuales
// 2. consumeCredits - Action para consumir créditos 
// 3. hasAvailableCredits - Utility function para validación
```

**Funciones específicas:**
- `getUserCredits(userId)` → Query
- `consumeCredits(userId, amount, operation)` → Action 
- `hasAvailableCredits(userId, amount)` → Helper function

### **Paso 3: Wasp Configuration (30 min)**

#### **File**: `main.wasp` (UPDATE)
```wasp
// Añadir después de user operations (línea ~190)
query getUserCredits {
  fn: import { getUserCredits } from "@src/credit/operations",
  entities: [User]
}

action consumeCredits {
  fn: import { consumeCredits } from "@src/credit/operations", 
  entities: [User]
}
```

### **Paso 4: Integration Layer (1.5 horas)**

#### **File**: `src/credit/integration.ts` (NUEVO)
```typescript
// Wrapper functions para APIs externas
export const withCreditCheck = (operation: string, cost: number) => {
  // Higher order function que:
  // 1. Verifica créditos disponibles
  // 2. Ejecuta la operación  
  // 3. Consume créditos si es exitosa
  // 4. Maneja errores con ServiceError
}
```

**Costos por operación:**
- DataForSEO Keyword Extraction: 2 créditos
- DataForSEO Visibility Testing: 3 créditos  
- OpenRouter Query Generation: 1 crédito

### **Paso 5: UI Components (2 horas)**

#### **File**: `src/components/ui/credit-indicator.tsx` (NUEVO)
```tsx
// Componente para mostrar créditos restantes
export function CreditIndicator({ 
  currentCredits, 
  showDetails = false 
}: CreditIndicatorProps)
```

#### **File**: `src/user/UserDropdown.tsx` (UPDATE)
```tsx
// Añadir indicator de créditos en el dropdown del usuario
// Mostrar "Credits: X remaining" 
```

#### **File**: `src/client/components/NavBar/NavBar.tsx` (UPDATE) 
```tsx
// Opcional: Badge de créditos en la navbar
```

### **Paso 6: Error Handling (45 min)**

#### **File**: `src/types/errors.ts` (UPDATE)
```typescript
// Añadir nuevo tipo de error
export interface InsufficientCreditsError extends ServiceError {
  type: 'INSUFFICIENT_CREDITS'
  userMessage: 'Not enough credits available'
  requiredCredits: number
  availableCredits: number  
}
```

#### **File**: `src/credit/errors.ts` (NUEVO)
```typescript
// Factory functions para errores de créditos
export const createInsufficientCreditsError = (required: number, available: number)
```

### **Paso 7: Integration Points (1.5 horas)**

#### **Files to UPDATE**:
1. `src/demo-ai-app/operations.ts` - Envolver operaciones costosas
2. Cualquier servicio que use DataForSEO/OpenRouter
3. Añadir `await withCreditCheck('keyword-extraction', 2)` antes de operaciones

### **Paso 8: Tests (1.5 horas)**

#### **File**: `src/credit/operations.test.ts` (NUEVO)
```typescript
// Tests unitarios:
// 1. getUserCredits - retorna créditos correctos
// 2. consumeCredits - reduce créditos correctamente  
// 3. hasAvailableCredits - validación correcta
// 4. consumeCredits con créditos insuficientes - error apropiado
// 5. Integration con operaciones existentes
```

#### **File**: `src/credit/integration.test.ts` (NUEVO)
```typescript  
// Tests de integración:
// 1. withCreditCheck success path
// 2. withCreditCheck insufficient credits
// 3. withCreditCheck operation failure (no consume credits)
```

---

## 🔧 Orden de Implementación Optimizado

### **Sprint Micro-Tasks (8 horas):**

| Task | File | Time | Description |
|------|------|------|-------------|
| **1. Core Operations** | `src/credit/operations.ts` | 2h | getUserCredits, consumeCredits, helpers |
| **2. Wasp Config** | `main.wasp` | 30min | Query/Action definitions |
| **3. Integration Layer** | `src/credit/integration.ts` | 1h 30min | withCreditCheck HOF + cost mapping |
| **4. Error Handling** | `src/types/errors.ts`, `src/credit/errors.ts` | 45min | InsufficientCreditsError |
| **5. UI Components** | `src/components/ui/credit-indicator.tsx` | 1h 30min | Credit display component |
| **6. UI Integration** | `UserDropdown.tsx` | 30min | Show credits in user dropdown |
| **7. Service Integration** | Update existing operations | 1h | Wrap costly operations |
| **8. Unit Tests** | `src/credit/*.test.ts` | 1h 15min | Comprehensive test suite |

**Total: 8 horas**

---

## 🎯 Definition of Done - CS-001

### **Functional Requirements:**
- [ ] **Credit Tracking**: Usuarios pueden ver sus créditos restantes
- [ ] **Credit Consumption**: Créditos se consumen automáticamente en operaciones costosas  
- [ ] **Quota Enforcement**: Operaciones bloqueadas cuando créditos insuficientes
- [ ] **Error Handling**: Mensajes claros cuando no hay créditos suficientes
- [ ] **UI Integration**: Créditos visibles en interfaz de usuario

### **Technical Requirements:**
- [ ] **Operations Created**: getUserCredits query + consumeCredits action
- [ ] **Wasp Config**: Operations declaradas en main.wasp
- [ ] **Integration**: APIs externas envueltas con credit checks
- [ ] **Tests**: 10+ unit tests con 100% coverage del credit system
- [ ] **Error Types**: InsufficientCreditsError implementado

### **Quality Gates:**
- [ ] **Tests Passing**: `npm run test:run` - todos los tests pasan
- [ ] **TypeScript**: No errores de tipos
- [ ] **Manual Testing**: Flujo completo probado manualmente
- [ ] **UI Working**: Créditos se muestran y actualizan correctamente

---

## 🚨 Notas de Implementación Críticas

### **Decisiones de Diseño:**

1. **Credit Costs:**
   - DataForSEO Keyword: 2 créditos (operación más costosa)
   - DataForSEO Visibility: 3 créditos (operación premium) 
   - OpenRouter Query: 1 crédito (operación básica)

2. **Error Strategy:**
   - Usar ServiceError existente para consistencia
   - Mensajes user-friendly sin detalles técnicos
   - Correlation IDs para debugging

3. **UI Strategy:**
   - Mostrar créditos en UserDropdown (siempre visible)
   - Credit indicator en operaciones costosas (antes de ejecutar)
   - Warning cuando créditos < 5

4. **Database Strategy:**
   - NO crear tabla separada (usar campo existente)
   - NO tracking histórico por ahora (KISS principle)
   - Transacciones atómicas para credit consumption

### **Files que NO modificar:**
- `schema.prisma` - Campo credits ya existe
- Sistema de pagos existente
- Core authentication

### **Pattern Consistency:**
- Seguir patrón de `src/user/operations.ts` exactamente
- Usar Zod para validación como en ejemplos existentes
- HttpError para errores como en codebase actual
- Prisma transactions para operaciones críticas

---

## 🧪 Testing Strategy

### **Unit Tests (6 tests mínimos):**
```typescript
describe('Credit Operations', () => {
  test('getUserCredits returns user credits')
  test('consumeCredits reduces credits correctly')
  test('consumeCredits throws error when insufficient credits') 
  test('hasAvailableCredits validates correctly')
  test('withCreditCheck prevents operation when insufficient credits')
  test('withCreditCheck consumes credits after successful operation')
})
```

### **Integration Tests (4 tests mínimos):**
```typescript  
describe('Credit Integration', () => {
  test('DataForSEO operation consumes 2 credits')
  test('OpenRouter operation consumes 1 credit')
  test('Failed operation does not consume credits')
  test('UI shows updated credits after consumption')
})
```

---

## 📊 Success Metrics

### **After Implementation:**
- [ ] **New user flow**: User sees "3 credits remaining"
- [ ] **Credit consumption**: Credits decrease after operations  
- [ ] **Quota enforcement**: Operations blocked at 0 credits
- [ ] **Error handling**: Clear message "Not enough credits"
- [ ] **Test coverage**: 100% for credit system
- [ ] **Performance**: No noticeable slowdown
- [ ] **UI feedback**: Credits update in real-time

### **Ready for CS-002:**
Con CS-001 completo, CS-002 (Credit Purchase) puede implementar:
- Stripe integration para compra de créditos
- Credit packages (10, 50, 100 credits)
- Auto-recharge cuando créditos < 2

---

**Este plan está optimizado para el boilerplate existente y sigue todos los patrones establecidos. ¿Procedo con la implementación?**