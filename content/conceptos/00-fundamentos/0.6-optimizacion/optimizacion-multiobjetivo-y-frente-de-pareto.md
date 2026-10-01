---
id: optimizacion-multiobjetivo-y-frente-de-pareto
titulo: Optimización multiobjetivo y frente de Pareto
titulo_en: Multi-objective optimization and Pareto front
alias:
  - óptimo de Pareto
  - frontera de Pareto
  - dominancia de Pareto
  - escalarización
modulo: 0
submodulo: '0.6'
orden: 23
nivel: avanzado
prerrequisitos:
  - problema-de-optimizacion
etiquetas:
  - multiobjetivo
  - Pareto
  - dominancia
  - suma ponderada
resumen: >
  Con varios objetivos en conflicto no hay un único óptimo: el frente de Pareto reúne las soluciones que
  ninguna otra mejora en todos los objetivos a la vez, y cada suma ponderada elige una de ellas.
formula: '\mathbf{x} \text{ domina a } \mathbf{y} \iff f_j(\mathbf{x}) \le f_j(\mathbf{y})\ \forall j \ \text{y}\ f_j(\mathbf{x}) < f_j(\mathbf{y}) \text{ para algún } j'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: pareto
referencias:
  - clave: boyd
    capitulo: '4.7'
publicado: true
---

## Intuición

Al elegir un automóvil se quiere bajo precio y bajo consumo, pero los modelos más eficientes suelen ser más caros. No existe un auto que gane en ambos frentes. Lo que sí se puede hacer es descartar los que pierden en todo: si un modelo es más caro y además consume más que otro, nadie debería elegirlo. Los que quedan, aquellos que solo se pueden mejorar en un objetivo empeorando el otro, forman el frente de Pareto.

La optimización multiobjetivo no entrega una respuesta sino ese conjunto de compromisos razonables. Elegir dentro de él requiere decidir cuánto importa cada objetivo, algo que las matemáticas no deciden por sí solas. Una forma común es asignar pesos y minimizar la suma ponderada: con peso alto en el precio sale un auto barato, con peso alto en el consumo uno eficiente. Al recorrer los pesos se recorre el frente. En aprendizaje automático aparece al equilibrar error y complejidad, precisión y equidad, o exhaustividad y precisión.

## Definición

Se minimizan a la vez $f_1(\mathbf{x}), \dots, f_m(\mathbf{x})$ sobre un conjunto factible $\mathcal{X}$.

:::definicion[Dominancia y óptimo de Pareto]
$\mathbf{x}$ **domina** a $\mathbf{y}$ si $f_j(\mathbf{x}) \le f_j(\mathbf{y})$ para todo $j$ y la desigualdad es estricta para al menos un $j$. Un punto factible es **óptimo de Pareto** si ningún punto factible lo domina. El **frente de Pareto** es el conjunto de vectores $\big(f_1(\mathbf{x}), \dots, f_m(\mathbf{x})\big)$ de los óptimos de Pareto.
:::

:::definicion[Escalarización por suma ponderada]
Para pesos $w_j \ge 0$ con $\sum_j w_j = 1$,
$$
\min_{\mathbf{x} \in \mathcal{X}} \sum_{j=1}^{m} w_j\,f_j(\mathbf{x}).
$$
Si todos los $w_j > 0$, toda solución es óptimo de Pareto. Si el problema es convexo, todo óptimo de Pareto se obtiene con algunos pesos $w_j \ge 0$.
:::

:::nota[Qué significa cada símbolo]
- $f_1, \dots, f_m$: objetivos que se minimizan; $m$: número de objetivos.
- $\mathbf{x}$, $\mathbf{y}$: decisiones factibles; $\mathcal{X}$: conjunto factible.
- $w_j$: peso del objetivo $j$, no negativo; los pesos suman 1.
- $\forall j$: para todo $j$.
:::

## Cómo usar la visualización

Hay dos objetivos: estar cerca de $\mathbf{a} = (0, 0)$ y cerca de $\mathbf{b} = (2, 1)$, medidos con la distancia al cuadrado. A la izquierda, 150 decisiones al azar en el plano; a la derecha, sus valores $(f_1, f_2)$. Los puntos naranjas son los no dominados entre los candidatos y la curva verde es el frente exacto, que corresponde al segmento de $\mathbf{a}$ a $\mathbf{b}$. La reproducción barre el peso $w$ de $f_1$ de 0 a 1: el punto amarillo es el mínimo de $w f_1 + (1 - w) f_2$, y el encabezado escribe su decisión y sus dos objetivos.

Al aumentar $w$, el punto amarillo se desliza por el segmento hacia $\mathbf{a}$ y, en el espacio de objetivos, recorre el frente desde $f_1$ grande y $f_2$ pequeño hasta lo contrario.

## Ejemplo

Se minimizan $f_1(\mathbf{x}) = \lVert \mathbf{x} - \mathbf{a} \rVert^2$ y $f_2(\mathbf{x}) = \lVert \mathbf{x} - \mathbf{b} \rVert^2$ con $\mathbf{a} = (0, 0)$ y $\mathbf{b} = (2, 1)$, usando la suma ponderada con $w = 0.5$.

1. Objetivo: $0.5\,\lVert \mathbf{x} - \mathbf{a} \rVert^2 + 0.5\,\lVert \mathbf{x} - \mathbf{b} \rVert^2$.
2. Gradiente igual a cero: $\mathbf{x} - \mathbf{a} + \mathbf{x} - \mathbf{b} = \mathbf{0}$, de donde $\mathbf{x} = w\,\mathbf{a} + (1 - w)\,\mathbf{b} = (1, 0.5)$.
3. Objetivos: $f_1 = 1 + 0.25 = 1.25$ y $f_2 = 1 + 0.25 = 1.25$.
4. Dominancia: el punto $(1, 1)$ tiene $f_1 = 2$ y $f_2 = 1$; ni lo domina $(1, 0.5)$ en $f_2$ ni lo contrario en ambos. En cambio $(1, 1.5)$, con $f_1 = 3.25$ y $f_2 = 1.25$, está dominado por $(1, 0.5)$.
5. Cada $w$ da otro punto del segmento: con $w = 0.2$, $\mathbf{x} = (1.6, 0.8)$, $f_1 = 3.2$ y $f_2 = 0.2$.

:::figura[Con peso w = 0.5 la suma ponderada elige (1, 0.5), el punto medio del segmento, con f₁ = f₂ = 1.25; la figura abre en pausa sobre ese peso.]{componente="OptimizerRace"}
```yaml
modo: pareto
peso: 0.5
```
:::

## Propiedades

- **Frente como curva de compromiso:** a lo largo del frente, mejorar un objetivo obliga a empeorar otro.
- **Suma ponderada:** con pesos positivos da óptimos de Pareto; en problemas convexos alcanza todo el frente variando los pesos.
- **Frentes no convexos:** si el frente tiene partes cóncavas hacia el origen, ninguna suma ponderada las alcanza; se usan restricciones $f_2 \le \varepsilon$ en su lugar.
- **Conjunto de Pareto:** en el ejemplo, el conjunto de decisiones óptimas es el segmento de $\mathbf{a}$ a $\mathbf{b}$; cualquier punto fuera de él está dominado por su proyección sobre el segmento.
- **Muestras finitas:** entre candidatos al azar, los no dominados aproximan el frente pero quedan por encima de él.

:::figura[Con peso w = 0.2 el óptimo ponderado es (1.6, 0.8), cerca de b, con f₁ = 3.2 y f₂ = 0.2: otro punto del mismo frente, ahora con otros candidatos al azar.]{componente="OptimizerRace"}
```yaml
modo: pareto
peso: 0.2
semilla: 3
```
:::

## Errores comunes

- **Buscar el único óptimo.** Con objetivos en conflicto no existe; hay que elegir un compromiso dentro del frente.
- **Elegir un punto dominado.** Si otra opción es igual o mejor en todo, la elegida no tiene justificación.
- **Poner peso cero a un objetivo sin advertirlo.** Con $w = 1$ se ignora $f_2$ por completo y se obtiene un extremo del frente.
- **Sumar objetivos en escalas distintas sin normalizar.** Si un objetivo se mide en miles y otro en unidades, los pesos pierden su significado.

:::figura[Con w = 1 se ignora el segundo objetivo: la decisión es a = (0, 0), con f₁ = 0 pero f₂ = 5, el extremo del frente más alejado de b.]{componente="OptimizerRace"}
```yaml
modo: pareto
peso: 1
```
:::

## Conexiones

Extiende el [[problema-de-optimizacion]] a varios objetivos. La suma ponderada convierte el problema en uno de [[optimizacion-convexa]] cuando cada objetivo es convexo, y la versión con restricciones se trata con [[optimizacion-con-restricciones]]. Las variantes de los [[algoritmos-geneticos]] aproximan frentes completos con una población. Los objetivos del ejemplo son cuadrados de la norma euclidiana de las [[normas-vectoriales]].

## Formulario

:::formula[Dominancia]
$$
\mathbf{x} \prec \mathbf{y} \iff f_j(\mathbf{x}) \le f_j(\mathbf{y})\ \forall j\ \text{ y }\ f_k(\mathbf{x}) < f_k(\mathbf{y}) \text{ para algún } k
$$

- $\prec$: "domina a"; $f_j$: objetivo $j$.
:::

:::formula[Suma ponderada]
$$
\min_{\mathbf{x} \in \mathcal{X}} \sum_{j=1}^{m} w_j f_j(\mathbf{x}), \qquad w_j \ge 0,\ \sum_j w_j = 1
$$

- $w_j$: pesos; $\mathcal{X}$: conjunto factible.
:::

:::formula[Óptimo ponderado de dos distancias]
$$
\mathbf{x}(w) = w\,\mathbf{a} + (1 - w)\,\mathbf{b}
$$

- $\mathbf{a}$, $\mathbf{b}$: puntos ideales de $f_1$ y $f_2$; $w$: peso de $f_1$.
:::

:::formula[Método de la restricción]
$$
\min_{\mathbf{x}} f_1(\mathbf{x}) \quad \text{s. a.} \quad f_2(\mathbf{x}) \le \varepsilon
$$

- $\varepsilon$: nivel máximo permitido de $f_2$; al variarlo se recorre el frente, incluidas sus partes no convexas.
:::
