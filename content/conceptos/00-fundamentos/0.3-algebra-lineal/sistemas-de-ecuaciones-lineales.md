---
id: sistemas-de-ecuaciones-lineales
titulo: Sistemas de ecuaciones lineales
titulo_en: Systems of linear equations
alias:
  - sistema lineal
  - sistema de ecuaciones
  - sistema compatible
  - sistema incompatible
modulo: 0
submodulo: '0.3'
orden: 22
nivel: basico
prerrequisitos:
  - teorema-del-rango-y-la-nulidad
  - matriz-identidad-y-matriz-inversa
etiquetas:
  - sistemas lineales
  - soluciones
  - rectas que se cortan
  - forma matricial
resumen: >
  Un sistema de ecuaciones lineales se escribe Ax = b; puede tener una solución, infinitas o ninguna,
  según las rectas o planos se corten en un punto, coincidan o sean paralelos.
formula: '\mathbf{A}\mathbf{x} = \mathbf{b} \ \text{tiene solución} \iff \mathbf{b} \in C(\mathbf{A}) \iff \operatorname{rango}(\mathbf{A}) = \operatorname{rango}[\mathbf{A} \mid \mathbf{b}]'
visualizacion:
  componente: VectorPlane
  parametros:
    modo: sistema
    ecuaciones: [[2, 1, 5], [1, -1, 1]]
    alternativas:
      - nombre: Una solución
        ecuaciones: [[2, 1, 5], [1, -1, 1]]
      - nombre: Sin solución (rectas paralelas)
        ecuaciones: [[1, 2, 4], [2, 4, 3]]
      - nombre: Infinitas soluciones (misma recta)
        ecuaciones: [[1, 2, 4], [2, 4, 8]]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

Cada ecuación lineal con dos incógnitas es una recta en el plano: los puntos que la cumplen. Resolver un sistema de dos ecuaciones es encontrar los puntos que cumplen ambas, es decir, donde se cortan las dos rectas. Dos rectas en el plano solo pueden hacer tres cosas: cortarse en un punto, ser paralelas y nunca tocarse, o ser la misma recta. Por eso un sistema lineal tiene exactamente una solución, ninguna o infinitas; nunca dos ni diez.

Hay una segunda lectura, por columnas. El sistema $\mathbf{A}\mathbf{x} = \mathbf{b}$ pregunta con qué pesos hay que combinar las columnas de $\mathbf{A}$ para llegar a $\mathbf{b}$. Si las columnas generan todo el plano, hay una combinación y es única. Si están sobre una misma recta y $\mathbf{b}$ está fuera de ella, no hay manera de alcanzarlo; si $\mathbf{b}$ está en la recta, hay infinitas maneras. Ambas lecturas describen el mismo sistema.

## Definición

:::definicion[Sistema de ecuaciones lineales]
Un sistema de $m$ ecuaciones lineales con $n$ incógnitas es
$$
\begin{aligned}
a_{11}x_1 + \dots + a_{1n}x_n &= b_1 \\
&\ \,\vdots \\
a_{m1}x_1 + \dots + a_{mn}x_n &= b_m
\end{aligned}
\qquad\Longleftrightarrow\qquad \mathbf{A}\mathbf{x} = \mathbf{b}.
$$
Es **homogéneo** si $\mathbf{b} = \mathbf{0}$. Es **compatible** si tiene al menos una solución e **incompatible** si no tiene ninguna.
:::

:::teorema[Rouché-Frobenius]
$\mathbf{A}\mathbf{x} = \mathbf{b}$ tiene solución si y solo si $\operatorname{rango}(\mathbf{A}) = \operatorname{rango}[\mathbf{A} \mid \mathbf{b}]$. En ese caso la solución es única si el rango es $n$, y hay infinitas, con $n - \operatorname{rango}(\mathbf{A})$ parámetros libres, si es menor.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{A}$: matriz de coeficientes, de $m \times n$.
- $a_{ij}$: coeficiente de la incógnita $x_j$ en la ecuación $i$.
- $\mathbf{x} = (x_1, \dots, x_n)$: vector de incógnitas.
- $\mathbf{b} = (b_1, \dots, b_m)$: lado derecho.
- $[\mathbf{A} \mid \mathbf{b}]$: matriz aumentada, $\mathbf{A}$ con la columna $\mathbf{b}$ agregada.
- $m$, $n$: número de ecuaciones y de incógnitas.
:::

## Cómo usar la visualización

El selector elige un sistema de dos ecuaciones. En la vista de filas cada ecuación es una recta y la solución es su intersección; en la vista de columnas se combinan las dos columnas de $\mathbf{A}$ con los pesos $x$ y $y$ para llegar al lado derecho. Los controles cambian los coeficientes, y el panel muestra el determinante, el tipo de sistema y la solución.

En el sistema sin solución las rectas son paralelas y, en la vista de columnas, las dos columnas apuntan en la misma dirección mientras que el lado derecho se sale de ella. Al cambiar un solo coeficiente para que el determinante deje de ser cero, las rectas se cortan y aparece una solución única.

## Ejemplo

Una familia compra 5 boletos de cine. Los de adulto cuestan 8 decenas de pesos y los de niño 5, y paga 34 decenas en total. Sean $x$ los boletos de adulto y $y$ los de niño.

1. Sistema: $x + y = 5$ y $8x + 5y = 34$.
2. Forma matricial: $\begin{pmatrix} 1 & 1 \\ 8 & 5 \end{pmatrix}\begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} 5 \\ 34 \end{pmatrix}$, con determinante $5 - 8 = -3 \neq 0$: solución única.
3. De la primera, $y = 5 - x$. Sustituyendo: $8x + 25 - 5x = 34$, así que $3x = 9$ y $x = 3$.
4. Entonces $y = 2$: tres adultos y dos niños.
5. Comprobación: $3 + 2 = 5$ y $24 + 10 = 34$ decenas, es decir, 340 pesos.

:::figura[El sistema de los boletos: las dos rectas se cortan en (3, 2). En la vista de columnas, 3 veces la primera columna más 2 veces la segunda llegan al lado derecho.]{componente="VectorPlane"}
```yaml
modo: sistema
ecuaciones: [[1, 1, 5], [8, 5, 34]]
```
:::

## Propiedades

- **Tres casos:** un sistema lineal tiene una, ninguna o infinitas soluciones.
- **Sistemas homogéneos:** siempre tienen la solución $\mathbf{x} = \mathbf{0}$; sus soluciones forman el espacio nulo.
- **Estructura de las soluciones:** si $\mathbf{x}_p$ resuelve $\mathbf{A}\mathbf{x} = \mathbf{b}$, todas las soluciones son $\mathbf{x}_p + \mathbf{n}$ con $\mathbf{n} \in N(\mathbf{A})$.
- **Matriz cuadrada:** si $\det \mathbf{A} \neq 0$, la única solución es $\mathbf{x} = \mathbf{A}^{-1}\mathbf{b}$.
- **Operaciones equivalentes:** intercambiar ecuaciones, multiplicar una por un número no nulo o sumarle un múltiplo de otra no cambia las soluciones.
- **En el espacio:** con tres incógnitas cada ecuación es un plano, y la solución es la intersección de planos: un punto, una recta, un plano o nada.

:::figura[Casos de sistemas sin solución y con infinitas soluciones: rectas paralelas que no se tocan y dos ecuaciones que describen la misma recta.]{componente="VectorPlane"}
```yaml
modo: sistema
ecuaciones: [[1, -2, 2], [-2, 4, 2]]
alternativas:
  - nombre: Paralelas, sin solución
    ecuaciones: [[1, -2, 2], [-2, 4, 2]]
  - nombre: Misma recta, infinitas soluciones
    ecuaciones: [[1, -2, 2], [-2, 4, -4]]
```
:::

:::demostracion
Tres casos: si $\mathbf{x}_1 \neq \mathbf{x}_2$ son soluciones, $\mathbf{A}(\mathbf{x}_1 - \mathbf{x}_2) = \mathbf{0}$ con $\mathbf{x}_1 - \mathbf{x}_2 \neq \mathbf{0}$. Entonces $\mathbf{x}_1 + t(\mathbf{x}_1 - \mathbf{x}_2)$ es solución para todo $t$: en cuanto hay dos, hay infinitas.
:::

## Errores comunes

- **Concluir "sin solución" porque hay más ecuaciones que incógnitas.** Si las ecuaciones son consistentes, puede haber solución.
- **Concluir "solución única" porque hay tantas ecuaciones como incógnitas.** Si el determinante es cero, no la hay o hay infinitas.
- **Dividir entre una expresión que puede ser cero al despejar.** Se pierden casos; la eliminación ordenada evita el problema.
- **Olvidar verificar.** Sustituir la solución en todas las ecuaciones detecta errores de cálculo.

## Conexiones

La existencia y el número de soluciones se leen del [[teorema-del-rango-y-la-nulidad]] y de si $\mathbf{b}$ está en el espacio columna. Con matriz cuadrada invertible la solución es $\mathbf{A}^{-1}\mathbf{b}$, como en [[matriz-identidad-y-matriz-inversa]]. El método general de resolución es la [[eliminacion-gaussiana]], que la [[descomposicion-lu]] organiza para muchos lados derechos. Cuando no hay solución exacta, los mínimos cuadrados buscan la mejor aproximación con la [[pseudoinversa-de-moore-penrose]].

## Formulario

:::formula[Forma matricial]
$$
\mathbf{A}\mathbf{x} = \mathbf{b}, \qquad x_1\mathbf{a}_1 + \dots + x_n\mathbf{a}_n = \mathbf{b}
$$

- $\mathbf{a}_j$: columna $j$ de $\mathbf{A}$.
- $x_j$: incógnita $j$, peso de la columna $j$.
:::

:::formula[Existencia]
$$
\operatorname{rango}(\mathbf{A}) = \operatorname{rango}[\mathbf{A} \mid \mathbf{b}]
$$

- $[\mathbf{A} \mid \mathbf{b}]$: matriz aumentada.
:::

:::formula[Solución general]
$$
\mathbf{x} = \mathbf{x}_p + c_1\mathbf{n}_1 + \dots + c_k\mathbf{n}_k, \qquad k = n - \operatorname{rango}(\mathbf{A})
$$

- $\mathbf{x}_p$: solución particular.
- $\mathbf{n}_i$: base del espacio nulo.
- $c_i$: parámetros libres.
:::

:::formula[Caso cuadrado invertible]
$$
\det \mathbf{A} \neq 0 \ \Rightarrow\ \mathbf{x} = \mathbf{A}^{-1}\mathbf{b}
$$

- $\mathbf{A}^{-1}$: inversa de $\mathbf{A}$.
:::
