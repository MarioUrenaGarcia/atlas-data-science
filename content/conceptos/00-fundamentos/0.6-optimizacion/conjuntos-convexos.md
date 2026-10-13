---
id: conjuntos-convexos
titulo: Conjuntos convexos
titulo_en: Convex sets
alias:
  - conjunto convexo
  - combinación convexa
  - envolvente convexa
modulo: 0
submodulo: '0.6'
orden: 3
nivel: intermedio
prerrequisitos:
  - problema-de-optimizacion
etiquetas:
  - convexidad
  - región factible
  - segmento
  - geometría
resumen: >
  Un conjunto es convexo si el segmento que une dos de sus puntos queda completamente dentro de él; las
  regiones definidas por desigualdades lineales y las bolas son convexas.
formula: '\mathbf{x}, \mathbf{y} \in C,\ \lambda \in [0, 1] \ \Rightarrow\ \lambda\mathbf{x} + (1 - \lambda)\mathbf{y} \in C'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: convexo
    conjuntos: [disco, luna, poligono, anillo, elipse, cruz]
referencias:
  - clave: boyd
    capitulo: '2'
publicado: true
---

## Intuición

Una alberca rectangular es convexa: desde cualquier punto se puede nadar en línea recta a cualquier otro sin salir del agua. Una alberca en forma de L no lo es: entre un extremo y el otro, la línea recta atraviesa el borde. Esa es toda la idea: un conjunto es convexo si no tiene entrantes, huecos ni partes separadas que obliguen a rodear.

En optimización la convexidad de la región factible es decisiva. Si la región es convexa y el objetivo también lo es, no hay valles escondidos detrás de un borde y cualquier mínimo local es global; los algoritmos pueden avanzar en línea recta sin salirse. Por suerte muchas regiones habituales son convexas: las que se definen con desigualdades lineales, como presupuestos y capacidades, las bolas y las elipses, y cualquier intersección de conjuntos convexos.

## Definición

:::definicion[Conjunto convexo]
Un conjunto $C \subseteq \mathbb{R}^n$ es **convexo** si para todo par de puntos $\mathbf{x}, \mathbf{y} \in C$ y todo $\lambda \in [0, 1]$,
$$
\lambda\mathbf{x} + (1 - \lambda)\mathbf{y} \in C.
$$
:::

El punto $\lambda\mathbf{x} + (1 - \lambda)\mathbf{y}$ recorre el segmento de $\mathbf{y}$ ($\lambda = 0$) a $\mathbf{x}$ ($\lambda = 1$). Más en general, una **combinación convexa** de $\mathbf{x}_1, \dots, \mathbf{x}_k$ es $\sum_i \lambda_i \mathbf{x}_i$ con $\lambda_i \ge 0$ y $\sum_i \lambda_i = 1$; un conjunto convexo contiene todas las combinaciones convexas de sus puntos. La **envolvente convexa** de un conjunto es el menor conjunto convexo que lo contiene.

:::nota[Qué significa cada símbolo]
- $C$: conjunto de puntos de $\mathbb{R}^n$.
- $\mathbf{x}, \mathbf{y}$: dos puntos cualesquiera de $C$.
- $\lambda$: peso entre 0 y 1 que recorre el segmento.
- $\lambda\mathbf{x} + (1 - \lambda)\mathbf{y}$: punto del segmento entre $\mathbf{y}$ y $\mathbf{x}$.
- $\lambda_i$: pesos de una combinación convexa, no negativos y con suma 1.
:::

## Cómo usar la visualización

El conjunto aparece sombreado. La reproducción toma pares de puntos al azar dentro de él y traza el segmento que los une: verde si queda dentro, naranja si sale, con un círculo en el primer punto fuera. El encabezado describe el par actual y el panel lleva la cuenta de segmentos que salen. El selector cambia de conjunto y la semilla cambia los pares.

En el disco, el polígono y la elipse ningún segmento sale, por más pares que se prueben. En la media luna, el anillo y la cruz aparecen pronto segmentos que salen: basta uno para probar que el conjunto no es convexo.

## Ejemplo

Una antena cubre un disco de radio 1.5 km alrededor del origen, $C = \{\mathbf{x} : \lVert \mathbf{x} \rVert \le 1.5\}$. Se verifica que la zona de cobertura es convexa.

1. Sean $\mathbf{x}, \mathbf{y} \in C$ y $\lambda \in [0, 1]$.
2. Por la desigualdad del triángulo, $\lVert \lambda\mathbf{x} + (1 - \lambda)\mathbf{y} \rVert \le \lambda\lVert \mathbf{x} \rVert + (1 - \lambda)\lVert \mathbf{y} \rVert$.
3. Como $\lVert \mathbf{x} \rVert \le 1.5$ y $\lVert \mathbf{y} \rVert \le 1.5$, el lado derecho es a lo más $\lambda \cdot 1.5 + (1 - \lambda) \cdot 1.5 = 1.5$.
4. Así que todo punto del segmento está en $C$: el disco es convexo.
5. Caso numérico: para $\mathbf{x} = (1.2, 0)$, $\mathbf{y} = (0, 1.4)$ y $\lambda = 0.5$, el punto medio es $(0.6, 0.7)$, a distancia $0.922 \le 1.5$.

:::figura[La zona de cobertura del ejemplo: ningún segmento entre dos puntos del disco sale de él, como garantiza la desigualdad del triángulo.]{componente="OptimizerRace"}
```yaml
modo: convexo
conjuntos: [disco]
semilla: 3
```
:::

## Propiedades

- **Intersecciones:** la intersección de conjuntos convexos es convexa; por eso las regiones definidas por varias desigualdades lineales, llamadas poliedros, son convexas.
- **Semiespacios e hiperplanos:** $\{\mathbf{x} : \mathbf{a}^\top \mathbf{x} \le b\}$ y $\{\mathbf{x} : \mathbf{a}^\top \mathbf{x} = b\}$ son convexos.
- **Bolas y elipsoides:** $\{\mathbf{x} : \lVert \mathbf{x} - \mathbf{c} \rVert \le r\}$ y $\{\mathbf{x} : (\mathbf{x} - \mathbf{c})^\top \mathbf{P}^{-1}(\mathbf{x} - \mathbf{c}) \le 1\}$, con $\mathbf{P} \succ 0$, son convexos.
- **Transformaciones afines:** la imagen de un conjunto convexo bajo $\mathbf{x} \mapsto \mathbf{A}\mathbf{x} + \mathbf{b}$ es convexa.
- **Subniveles de funciones convexas:** si $f$ es convexa, $\{\mathbf{x} : f(\mathbf{x}) \le c\}$ es convexo.

:::figura[Una intersección de semiplanos: el polígono definido por cuatro desigualdades lineales es convexo, y ningún segmento entre dos de sus puntos sale de él.]{componente="OptimizerRace"}
```yaml
modo: convexo
conjuntos: [poligono]
semilla: 5
```
:::

## Errores comunes

- **Creer que la unión de convexos es convexa.** Dos rectángulos cruzados son convexos por separado, pero su unión, una cruz, no lo es.
- **Confundir conjunto convexo con función convexa.** Una función es convexa si el conjunto de puntos sobre su gráfica lo es; el adjetivo se refiere a objetos distintos.
- **Pensar que el complemento de un convexo es convexo.** El exterior de un disco no lo es.
- **Concluir convexidad probando unos cuantos segmentos.** Una prueba numérica solo puede refutar; para probar convexidad hace falta un argumento, como en el ejemplo.

:::figura[La cruz es la unión de dos rectángulos convexos y no es convexa: los segmentos entre los extremos de brazos distintos atraviesan las esquinas vacías.]{componente="OptimizerRace"}
```yaml
modo: convexo
conjuntos: [cruz]
semilla: 2
```
:::

## Conexiones

Describen la región factible de un [[problema-de-optimizacion]]. Junto con las [[funciones-convexas-y-concavas]] definen la [[optimizacion-convexa]]. Las regiones de la [[programacion-lineal]] son poliedros convexos y las bolas de las [[normas-vectoriales]] son convexas. La desigualdad del triángulo del ejemplo es la misma que aparece en [[distancias]].

## Formulario

:::formula[Definición de convexidad]
$$
\mathbf{x}, \mathbf{y} \in C,\ \lambda \in [0, 1] \ \Rightarrow\ \lambda\mathbf{x} + (1 - \lambda)\mathbf{y} \in C
$$

- $C$: conjunto; $\mathbf{x}, \mathbf{y}$: puntos de $C$; $\lambda$: peso.
:::

:::formula[Combinación convexa]
$$
\sum_{i=1}^{k} \lambda_i \mathbf{x}_i, \qquad \lambda_i \ge 0, \quad \sum_{i=1}^{k} \lambda_i = 1
$$

- $\mathbf{x}_i$: puntos; $\lambda_i$: pesos.
:::

:::formula[Semiespacio y bola]
$$
\{\mathbf{x} : \mathbf{a}^\top \mathbf{x} \le b\}, \qquad \{\mathbf{x} : \lVert \mathbf{x} - \mathbf{c} \rVert \le r\}
$$

- $\mathbf{a}$: vector normal; $b$: número; $\mathbf{c}$: centro; $r$: radio.
:::
