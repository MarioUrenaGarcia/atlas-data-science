---
id: suficiencia-minima
titulo: Suficiencia mínima
titulo_en: Minimal sufficiency
alias:
  - estadístico suficiente minimal
  - estadístico suficiente mínimo
modulo: 6
submodulo: '6.2'
orden: 11
nivel: avanzado
prerrequisitos:
  - teorema-de-factorizacion-de-fisher-neyman
etiquetas:
  - inferencia
  - suficiencia
  - reducción de datos
  - cociente de verosimilitudes
resumen: >
  Un estadístico suficiente es mínimo si es función de cualquier otro estadístico suficiente: logra la
  mayor reducción de los datos posible sin perder información sobre el parámetro.
formula: '\frac{f_\theta(\mathbf{x})}{f_\theta(\mathbf{y})}\ \text{no depende de } \theta \iff T(\mathbf{x}) = T(\mathbf{y})'
visualizacion:
  componente: SufficiencyLab
  parametros:
    modo: suficiencia
    n: 4
    particion: suma-y-primero
referencias:
  - clave: casella-berger
    capitulo: '6'
publicado: true
---

## Intuición

La muestra completa siempre es suficiente, pero no resume nada. El número de defectos más el resultado de la primera pieza también es suficiente, pero guarda un dato de más que no aporta información. El número de defectos por sí solo ya contiene todo lo necesario. Entre todos los estadísticos suficientes, interesa el que comprime al máximo: el **suficiente mínimo**.

Pensado como una forma de agrupar las muestras posibles, cada estadístico suficiente parte el conjunto de muestras en grupos que "dicen lo mismo" sobre el parámetro. El mínimo es la partición más gruesa que todavía conserva toda la información: junta en un mismo grupo exactamente a las muestras cuyas verosimilitudes son proporcionales.

## Definición

:::definicion[Estadístico suficiente mínimo]
Un estadístico suficiente $T$ es **mínimo** si para cualquier otro estadístico suficiente $S$ existe una función $\varphi$ con $T = \varphi(S)$.
:::

:::teorema[Criterio del cociente de verosimilitudes]
Si $T$ cumple que, para cualesquiera dos muestras $\mathbf{x}$ y $\mathbf{y}$,
$$
\frac{f_\theta(\mathbf{x})}{f_\theta(\mathbf{y})}\ \text{no depende de } \theta \iff T(\mathbf{x}) = T(\mathbf{y}),
$$
entonces $T$ es suficiente mínimo.
:::

:::nota[Qué significa cada símbolo]
- $T$, $S$: estadísticos suficientes; $\varphi$: función que obtiene $T$ a partir de $S$.
- $\mathbf{x}$, $\mathbf{y}$: dos muestras posibles.
- $f_\theta$: densidad o función de masa conjunta; $\theta$: parámetro.
:::

## Cómo usar la visualización

Las 16 secuencias de 4 ensayos se agrupan por el estadístico elegido. Con "éxitos y primer resultado" cada grupo de igual número de éxitos se parte en dos, y dentro de cada mitad la probabilidad condicional sigue sin depender de $p$: es suficiente, pero esa partición extra no se necesitaba.

Experimentos sugeridos:

1. Contar los grupos: 8 con "éxitos y primer resultado", 5 con el número de éxitos.
2. Cambiar al número de éxitos: sigue siendo suficiente con menos grupos; es la partición mínima.
3. Cambiar al primer resultado solo: hay menos grupos todavía, pero ya no es suficiente; se pasó del mínimo.

## Ejemplo

Bernoulli($p$) con $n$ ensayos y dos muestras $\mathbf{x}$ y $\mathbf{y}$ con $s$ y $u$ éxitos.

1. $\dfrac{f_p(\mathbf{x})}{f_p(\mathbf{y})} = \dfrac{p^s(1 - p)^{n - s}}{p^u(1 - p)^{n - u}} = \Big(\dfrac{p}{1 - p}\Big)^{s - u}$.
2. Ese cociente no depende de $p$ si y solo si $s = u$.
3. Por el criterio, $T = \sum X_i$ es suficiente mínimo.
4. El par $(\sum X_i, X_1)$ es suficiente pero no mínimo: dos muestras con igual total y distinto primer resultado tienen verosimilitudes proporcionales y el par las separa sin necesidad.

:::figura[Grupos por número de éxitos con 3 ensayos: la partición mínima, con 4 grupos.]{componente="SufficiencyLab"}
```yaml
modo: suficiencia
n: 3
particion: suma
```
:::

## Propiedades

- **Es único salvo funciones biyectivas.**
- **Normal con media y varianza desconocidas:** $(\bar{X}, S^2)$ es suficiente mínimo.
- **Uniforme en $(0, \theta)$:** el máximo $X_{(n)}$ es suficiente mínimo.
- **Puede tener tanta dimensión como la muestra:** para la Cauchy, el suficiente mínimo es la muestra ordenada.

:::figura[Normal con varianza conocida: muestras con igual media tienen verosimilitudes proporcionales, así que la media es suficiente mínima para mu.]{componente="SufficiencyLab"}
```yaml
modo: factorizacion
muestras: [[2, 6, 10], [5, 6, 7], [4, 4, 10]]
sigma: 2
```
:::

## Errores comunes

- **Creer que más compresión siempre es mejor.** Por debajo del mínimo se pierde información: el estadístico deja de ser suficiente.
- **Confundir mínimo con escalar.** Un suficiente mínimo puede ser un vector, como $(\bar{X}, S^2)$.
- **Suponer que suficiente mínimo implica completo.** Hay suficientes mínimos que no son completos.

:::figura[Por debajo del mínimo: agrupar solo por el primer resultado da menos grupos, pero pierde información sobre p.]{componente="SufficiencyLab"}
```yaml
modo: suficiencia
n: 4
particion: primero
```
:::

## Conexiones

La suficiencia mínima refina la [[suficiencia]] y se verifica con cocientes de verosimilitud, relacionados con el [[teorema-de-factorizacion-de-fisher-neyman]]. Junto con la [[completitud]] lleva al [[teorema-de-lehmann-scheffe]] y al [[teorema-de-basu]].

## Formulario

:::formula[Definición]
$$
T = \varphi(S)\ \text{para todo estadístico suficiente } S
$$

- $T$: suficiente mínimo; $\varphi$: función.
:::

:::formula[Criterio del cociente]
$$
\frac{f_\theta(\mathbf{x})}{f_\theta(\mathbf{y})}\ \text{no depende de } \theta \iff T(\mathbf{x}) = T(\mathbf{y})
$$

- $\mathbf{x}$, $\mathbf{y}$: muestras; $f_\theta$: densidad conjunta.
:::

:::formula[Cociente en el caso Bernoulli]
$$
\frac{f_p(\mathbf{x})}{f_p(\mathbf{y})} = \Big(\frac{p}{1 - p}\Big)^{s - u}
$$

- $s$, $u$: número de éxitos en cada muestra; $p$: probabilidad de éxito.
:::
