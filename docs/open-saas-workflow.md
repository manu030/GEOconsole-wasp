# Open SaaS Development Workflow - Claude Code Reference

> **📌 Documento de referencia definitivo para Claude Code**  
> Este documento debe ser consultado al inicio de cada sesión de desarrollo para mantener el flujo correcto y evitar errores de arquitectura.

---

## 🎯 CONTEXTO INICIAL OBLIGATORIO PARA CLAUDE CODE

**Proporciona SIEMPRE este contexto completo al iniciar:**

```
CONTEXTO: Desarrollo SaaS con Open SaaS (Wasp Framework)

STACK TÉCNICO:
- Framework: Wasp (React + Node.js + Prisma)
- Frontend: React 18 + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL con Prisma ORM
- Auth: Wasp Auth (Google, GitHub, Email + Password)
- Payments: Stripe (subscriptions + one-time)
- Deployment: Wasp Deploy (automático)

ESTRUCTURA DEL PROYECTO:
├── main.wasp                 # 🎯 CONFIGURACIÓN CENTRAL
├── schema.prisma            # Modelo de datos (dentro de main.wasp)
├── src/client/             # Frontend React
├── src/server/             # Backend Node.js
├── src/shared/             # Código compartido
├── .env.server             # Variables de entorno
└── migrations/             # Migraciones automáticas

SERVICIOS CONFIGURADOS:
✅ PostgreSQL (Railway/Supabase)
✅ Auth completo (social + email)
✅ Stripe (productos + webhooks)
✅ Email provider (SendGrid/Mailgun/Resend)
✅ Analytics (Plausible/Google Analytics)
✅ File upload (AWS S3/Cloudinary)
✅ Deploy pipeline automático

REGLAS CRÍTICAS:
1. NUNCA modificar archivos en .wasp/ (generados automáticamente)
2. SIEMPRE usar Operations de Wasp (no fetch directo)
3. MIGRAR DB después de cambios: wasp db migrate-dev
4. UN feature completo por iteración
5. VALIDAR con Zod en server-side
6. MANTENER type safety end-to-end
7. PROBAR localmente antes de deploy
```

---

## 📋 WORKFLOW DE DESARROLLO (MEJORADO)

### 🔍 PASO 1: ANÁLISIS PROFUNDO DE REQUERIMIENTO

**Claude Code DEBE hacer este análisis completo:**

#### 1.1 Análisis Funcional
```markdown
FEATURE: [Nombre descriptivo]

DESCRIPCIÓN DETALLADA:
- ¿Qué problema resuelve?
- ¿Quién puede acceder? (roles/permisos)
- ¿Cómo interactúa con features existentes?

IMPACTO EN SISTEMA:
- Entidades DB: [nuevas/modificadas]
- Operations: [queries/actions necesarias]
- UI Components: [páginas/componentes]
- Integraciones: [Stripe/Email/terceros]
```

#### 1.2 Revisión de Arquitectura Actual
```bash
# Claude Code debe analizar estos archivos PRIMERO:
1. main.wasp - Configuración actual
2. schema.prisma - Modelo de datos existente
3. src/client/pages/ - Páginas actuales
4. src/server/ - Lógica de negocio existente
```

#### 1.3 Plan de Implementación Detallado
```markdown
PLAN DE IMPLEMENTACIÓN:

FASE 1 - BASE DE DATOS:
[ ] Entidades: [lista específica]
[ ] Relaciones: [detalles]
[ ] Índices: [optimizaciones]

FASE 2 - BACKEND:
[ ] Queries: [listado con descripción]
[ ] Actions: [listado con validaciones]
[ ] Middleware: [permisos/validaciones]

FASE 3 - FRONTEND:
[ ] Pages: [rutas específicas]
[ ] Components: [reutilizables]
[ ] Hooks: [custom hooks necesarios]
[ ] Types: [interfaces TypeScript]

FASE 4 - TESTING:
[ ] Unit tests para actions críticas
[ ] Integration tests para flows principales
[ ] Manual testing checklist
```

### ⚙️ PASO 2: IMPLEMENTACIÓN ORDENADA Y DETALLADA

#### 2.1 Base de Datos (CRÍTICO - SIEMPRE PRIMERO)

**Modificaciones en main.wasp:**
```wasp
// Ejemplo de entidad bien estructurada
entity Task {=psl
  id          String   @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Int      @default(1)
  dueDate     DateTime?
  
  // Relaciones
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Índices para performance
  @@index([userId, status])
  @@index([dueDate])
psl=}

// Enum si es necesario
enum TaskStatus {
  TODO
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

**Comandos obligatorios después:**
```bash
wasp db migrate-dev
wasp db studio  # Verificar estructura
```

#### 2.2 Operations (Queries y Actions)

**Definición en main.wasp:**
```wasp
// QUERIES (solo lectura)
query getTasks {
  fn: import { getTasks } from "@server/queries.js",
  entities: [Task, User]
}

query getTaskById {
  fn: import { getTaskById } from "@server/queries.js",
  entities: [Task]
}

// ACTIONS (escritura)
action createTask {
  fn: import { createTask } from "@server/actions.js",
  entities: [Task]
}

action updateTask {
  fn: import { updateTask } from "@server/actions.js",
  entities: [Task]
}
```

**Implementación en server/ con validación:**
```typescript
// src/server/queries.ts
import type { GetTasks, GetTaskById } from '@wasp/queries/types';
import type { Task } from '@wasp/entities';

export const getTasks: GetTasks<void, Task[]> = async (args, context) => {
  if (!context.user) throw new Error('Not authenticated');
  
  return context.entities.Task.findMany({
    where: { userId: context.user.id },
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });
};

// src/server/actions.ts
import type { CreateTask } from '@wasp/actions/types';
import { z } from 'zod';

const CreateTaskPayload = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  priority: z.number().min(1).max(5).default(1),
  dueDate: z.date().optional()
});

export const createTask: CreateTask<typeof CreateTaskPayload._type, Task> = 
  async (args, context) => {
    if (!context.user) throw new Error('Not authenticated');
    
    const data = CreateTaskPayload.parse(args);
    
    return context.entities.Task.create({
      data: {
        ...data,
        userId: context.user.id
      }
    });
  };
```

#### 2.3 Frontend Components con Hooks

**Página principal:**
```typescript
// src/client/pages/TasksPage.tsx
import { getTasks, createTask } from '@wasp/queries';
import { useQuery, useAction } from '@wasp/queries';
import { useState } from 'react';

export default function TasksPage() {
  const { data: tasks, isLoading, error } = useQuery(getTasks);
  const createTaskAction = useAction(createTask);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTask = async (taskData) => {
    try {
      setIsCreating(true);
      await createTaskAction(taskData);
      // El cache se invalida automáticamente
    } catch (err) {
      console.error('Error creating task:', err);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <TaskForm onSubmit={handleCreateTask} isLoading={isCreating} />
      <TaskList tasks={tasks} />
    </div>
  );
}
```

**Definir rutas en main.wasp:**
```wasp
route TasksRoute { path: "/tasks", to: TasksPage }
page TasksPage {
  component: import { default } from "@client/pages/TasksPage.jsx",
  authRequired: true
}
```

### ✅ PASO 3: TESTING Y VERIFICACIÓN EXHAUSTIVA

#### 3.1 Testing Checklist Detallado
```markdown
TESTING OBLIGATORIO:

DATABASE:
[ ] wasp db migrate-dev ejecuta sin errores
[ ] wasp db studio muestra estructura correcta
[ ] Relaciones funcionan correctamente
[ ] Índices están creados

BACKEND:
[ ] Operations definidas en main.wasp
[ ] Validaciones con Zod funcionan
[ ] Permisos de auth respetados
[ ] Error handling apropiado
[ ] Logs informativos agregados

FRONTEND:
[ ] Componentes renderizan sin errores
[ ] TypeScript sin errores
[ ] Tailwind CSS aplicado correctamente
[ ] Loading states implementados
[ ] Error states manejados
[ ] Navegación funciona

INTEGRACIÓN:
[ ] Auth required en rutas protegidas
[ ] Cache invalidation automática
[ ] Real-time updates si aplica
[ ] Performance acceptable
```

#### 3.2 Comandos de Verificación
```bash
# Verificación completa del sistema
wasp start                    # Debe iniciar sin errores
wasp build                   # Build debe completarse
wasp db studio              # Verificar datos
wasp type-check             # TypeScript válido
```

---

## 🏗️ PATRONES DE DESARROLLO ESPECÍFICOS DE OPEN SAAS

### 1. Estructura de Componentes Reutilizables
```typescript
// src/client/components/common/
├── Layout/
│   ├── DashboardLayout.tsx
│   ├── AuthLayout.tsx
│   └── PublicLayout.tsx
├── UI/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   └── DataTable.tsx
├── Forms/
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── SettingsForm.tsx
└── Charts/
    ├── RevenueChart.tsx
    ├── UserGrowthChart.tsx
    └── AnalyticsPanel.tsx
```

### 2. Manejo de Estado Global
```typescript
// src/client/store/useGlobalState.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GlobalState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Notification) => void;
}

export const useGlobalState = create<GlobalState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'light',
      notifications: [],
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ theme }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),
    }),
    { name: 'global-state' }
  )
);
```

### 3. Custom Hooks para Operations
```typescript
// src/client/hooks/useTasks.ts
import { getTasks, createTask, updateTask, deleteTask } from '@wasp/queries';
import { useQuery, useAction } from '@wasp/queries';

export function useTasks() {
  const { data: tasks, isLoading, error, refetch } = useQuery(getTasks);
  
  const createTaskAction = useAction(createTask);
  const updateTaskAction = useAction(updateTask);
  const deleteTaskAction = useAction(deleteTask);

  const createTaskMutation = async (taskData: CreateTaskData) => {
    try {
      await createTaskAction(taskData);
      // Cache se actualiza automáticamente
    } catch (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
  };

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation,
    updateTask: updateTaskAction,
    deleteTask: deleteTaskAction,
    refetch
  };
}
```

---

## 🚨 TROUBLESHOOTING ESPECÍFICO DE WASP

### Errores Comunes y Soluciones

#### 1. Error de Migración
```bash
# Error: Migration failed
# Solución:
wasp clean
wasp db reset  # ⚠️ BORRA TODOS LOS DATOS
wasp db migrate-dev

# O para preservar datos:
wasp db studio  # Backup manual
# Editar migration manualmente en migrations/
wasp db migrate-dev
```

#### 2. Error de Type Safety
```bash
# Error: Type errors in operations
# Solución:
wasp build  # Regenera tipos
# Verificar imports en operations
# Verificar entidades en main.wasp
```

#### 3. Error de Auth
```bash
# Error: User not authenticated
# Verificar en main.wasp:
page MyPage {
  authRequired: true  # ⚠️ Asegurar esto
}

# Y en component:
const { data: user } = useAuth();
if (!user) return <div>Not authenticated</div>;
```

#### 4. Error de Deploy
```bash
# Error en deploy
wasp deploy  # Con logs detallados
# Verificar .env.server tiene todas las variables
# Verificar permisos de servicios externos
```

---

## 🎯 FEATURES COMUNES DE SAAS - TEMPLATES LISTOS

### 1. Sistema de Suscripciones
```wasp
// En main.wasp
entity Subscription {=psl
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id])
  stripeCustomerId  String?  @unique
  stripeSubscriptionId String? @unique
  status            SubscriptionStatus @default(INACTIVE)
  currentPeriodEnd  DateTime?
  cancelAtPeriodEnd Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
psl=}
```

### 2. Sistema de Notificaciones
```wasp
entity Notification {=psl
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  type      NotificationType
  title     String
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
  
  @@index([userId, read])
psl=}
```

### 3. Audit Log
```wasp
entity AuditLog {=psl
  id        String   @id @default(cuid())
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  action    String
  resource  String
  details   Json?
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  
  @@index([userId, createdAt])
  @@index([action, createdAt])
psl=}
```

---

## 📊 PERFORMANCE Y OPTIMIZACIÓN

### 1. Database Optimization
```wasp
// Índices estratégicos
entity Post {=psl
  // ... otros campos
  
  @@index([authorId, publishedAt])  // Para queries frecuentes
  @@index([status, createdAt])      // Para filtros
  @@fulltext([title, content])      // Para búsquedas
psl=}
```

### 2. Frontend Performance
```typescript
// Lazy loading de componentes
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Memoización de queries costosas
const { data: expensiveData } = useQuery(getExpensiveData, undefined, {
  staleTime: 5 * 60 * 1000, // 5 minutos
  cacheTime: 10 * 60 * 1000, // 10 minutos
});

// Paginación eficiente
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(
  getPaginatedData,
  {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  }
);
```

---

## 📈 MONITOREO Y LOGGING

### 1. Server-side Logging
```typescript
// src/server/utils/logger.ts
import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

// Uso en actions
export const createTask: CreateTask = async (args, context) => {
  logger.info('Creating task', { userId: context.user?.id, args });
  
  try {
    const task = await context.entities.Task.create({ data: args });
    logger.info('Task created successfully', { taskId: task.id });
    return task;
  } catch (error) {
    logger.error('Failed to create task', { error, userId: context.user?.id });
    throw error;
  }
};
```

### 2. Frontend Error Monitoring
```typescript
// src/client/utils/errorHandler.ts
export function setupErrorHandling() {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Enviar a servicio de monitoreo (Sentry, etc.)
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Enviar a servicio de monitoreo
  });
}
```

---

## 🎯 OBJETIVOS Y MÉTRICAS DE ÉXITO

### Por Cada Feature Implementado:

✅ **Funcionalidad:**
- Feature funciona 100% según especificaciones
- Casos edge manejados apropiadamente
- Error handling robusto

✅ **Performance:**
- Queries < 200ms en promedio
- UI responsive < 100ms
- Bundle size optimizado

✅ **Calidad:**
- TypeScript sin errores
- Code coverage > 80% en lógica crítica
- No console.errors en producción

✅ **UX:**
- Loading states apropiados
- Error messages útiles
- Navegación intuitiva

✅ **Security:**
- Auth requerido donde corresponde
- Validación server-side completa
- No data leaks entre usuarios

**RECUERDA: Con este workflow mejorado, cada feature debe estar listo para producción al completarse, sin necesidad de refactoring posterior.**