---
id: distancia-de-wasserstein-y-transporte-optimo
titulo: Distancia de Wasserstein y transporte óptimo
titulo_en: Wasserstein distance and optimal transport
alias:
  - distancia del movedor de tierra
  - earth mover's distance
  - EMD
  - W1
  - transporte óptimo
modulo: 0
submodulo: '0.8'
orden: 16
nivel: avanzado
prerrequisitos:
  - divergencia-de-kullback-leibler
  - funcion-de-distribucion-acumulada
  - programacion-lineal
relaciones:
  - tipo: contrasta
    id: divergencia-de-jensen-shannon
etiquetas:
  - transporte óptimo
  - distancias entre distribuciones
  - métricas
  - geometría
resumen: >
  La distancia de Wasserstein es el costo mínimo de transformar una distribución en otra moviendo masa,
  con costo igual a masa por distancia. A diferencia de KL, toma en cuenta qué tan lejos están los valores.
formula: 'W_1(p, q) = \min_{\gamma \in \Gamma(p, q)} \sum_{i, j} \gamma_{ij}\,|x_i - x_j| = \int |F_p(x) - F_q(x)|\,dx'
visualizacion:
  componente: InformationViz
  parametros:
    modo: wasserstein
    p: [0.1, 0.4, 0.3, 0.2, 0]
    q: [0, 0.1, 0.2, 0.3, 0.4]
referencias:
  - clave: murphy
  - clave: boyd
publicado: true
---

## Intuición

Un sistema de bicicletas compartidas tiene cinco estaciones a lo largo de una avenida. Por la mañana las bicicletas están repartidas de una forma y por la tarde se necesitan de otra. El camión de redistribución paga por cada bicicleta y por cada cuadra que la mueve. La pregunta es cuál es el plan de traslados más barato y cuánto cuesta.

Ese costo mínimo es la distancia de Wasserstein entre las dos distribuciones. Mide cuánto trabajo cuesta convertir una en otra, y por eso depende de la geometría: mover masa a la estación vecina es barato, llevarla al otro extremo es caro. Las divergencias de Kullback-Leibler o de Jensen-Shannon, en cambio, solo comparan probabilidades casilla por casilla: si dos distribuciones no se traslapan, dan infinito o su valor máximo sin importar si están cerca o lejos.

En una dimensión el plan óptimo es sencillo: se mueve la masa en orden, llenando de izquierda a derecha, y el costo es el área entre las dos funciones de distribución acumulada.

## Definición

:::definicion[Distancia de Wasserstein de orden 1]
Sean $p$ y $q$ distribuciones sobre puntos $x_1, \dots, x_k$. Un plan de transporte es una matriz $\gamma \ge 0$ con marginales $\sum_j \gamma_{ij} = p_i$ y $\sum_i \gamma_{ij} = q_j$; el conjunto de planes se denota $\Gamma(p, q)$. La distancia de Wasserstein es
$$
W_1(p, q) = \min_{\gamma \in \Gamma(p, q)} \sum_{i, j} \gamma_{ij}\,|x_i - x_j|.
$$
En la recta, con funciones de distribución acumulada $F_p$ y $F_q$,
$$
W_1(p, q) = \int_{-\infty}^{\infty} |F_p(x) - F_q(x)|\,dx.
$$
:::

El problema de minimización es un programa lineal. Con costo $|x_i - x_j|^r$ y raíz $r$-ésima del mínimo se obtiene la distancia $W_r$.

:::nota[Qué significa cada símbolo]
- $p$, $q$: distribuciones de origen y de destino; $p_i$, $q_j$: sus masas en cada punto.
- $x_1, \dots, x_k$: posiciones; $k$: número de posiciones.
- $\gamma_{ij}$: masa que se mueve de $x_i$ a $x_j$.
- $\Gamma(p, q)$: conjunto de planes con las marginales correctas.
- $|x_i - x_j|$: distancia recorrida.
- $W_1$: distancia de Wasserstein de orden 1.
- $F_p$, $F_q$: funciones de distribución acumulada.
- $r$: orden de la distancia $W_r$.
:::

## Cómo usar la visualización

Las barras rellenas son la masa de $p$ que falta por mover y la que ya llegó a su destino; los contornos punteados son $q$, el destino. Cada paso de la reproducción ejecuta un envío del plan monótono, dibujado como un arco cuyo grosor es la masa. El encabezado calcula el costo del envío actual y el acumulado; las lecturas comparan con la divergencia de Kullback-Leibler.

En la visualización principal el plan tiene seis envíos, cada uno de una posición a la siguiente o a dos de distancia. Al terminar, el costo acumulado es $W_1 = 1.4$, mientras $D_{\mathrm{KL}}(p \,\|\, q)$ es infinita porque $q$ no tiene masa en la primera posición.

## Ejemplo

Por la mañana, la mitad de las bicicletas está en la estación 1 y la mitad en la 2; por la tarde se necesitan la mitad en la 4 y la mitad en la 5.

1. Funciones acumuladas en las posiciones 1 a 5: $F_p = (0.5, 1, 1, 1, 1)$ y $F_q = (0, 0, 0, 0.5, 1)$.
2. Diferencias absolutas: $0.5, 1, 1, 0.5, 0$, cada una sobre un tramo de longitud 1.
3. $W_1 = 0.5 + 1 + 1 + 0.5 = 3$.
4. El plan óptimo lleva la mitad de la estación 1 a la 4 y la mitad de la 2 a la 5, cada mitad tres cuadras: $0.5 \cdot 3 + 0.5 \cdot 3 = 3$.

:::figura[Bicicletas de las estaciones 1 y 2 a las 4 y 5: dos envíos de media unidad recorren tres posiciones cada uno y el costo total es 3, mientras KL marca infinito.]{componente="InformationViz"}
```yaml
modo: wasserstein
p: [0.5, 0.5, 0, 0, 0]
q: [0, 0, 0, 0.5, 0.5]
```
:::

## Propiedades

- **Métrica:** $W_1$ es simétrica, no negativa, cero solo si $p = q$ y cumple la desigualdad del triángulo.
- **Traslación:** si $q$ es $p$ desplazada una distancia $c$, entonces $W_1(p, q) = |c|$.

:::figura[La misma distribución desplazada una sola posición: la distancia es 1, un tercio de la del ejemplo, aunque KL siga siendo infinita en los dos casos.]{componente="InformationViz"}
```yaml
modo: wasserstein
p: [0.5, 0.5, 0, 0, 0]
q: [0, 0.5, 0.5, 0, 0]
```
:::

- **Dualidad de Kantorovich-Rubinstein:** $W_1(p, q) = \sup_{f} \big(\mathbb{E}_p[f] - \mathbb{E}_q[f]\big)$ sobre funciones $f$ con pendiente acotada por 1.
- **Convergencia:** $W_1(p_n, p) \to 0$ equivale a convergencia en distribución más convergencia del primer momento absoluto.
- **Plan monótono en la recta:** en una dimensión, el plan que empareja los cuantiles en orden es óptimo.

## Errores comunes

- **Pensar que las divergencias de información ven la distancia entre valores.** Con soportes disjuntos, Jensen-Shannon vale 1 bit tanto si la masa se movió una posición como si se movió cuatro; Wasserstein da 1 y 4.

:::figura[Toda la masa en la posición 1 contra toda en la 5: un solo envío de masa 1 recorre cuatro posiciones y la distancia es 4, mientras KL es infinita y Jensen-Shannon valdría 1 bit, lo mismo que si estuvieran en posiciones vecinas.]{componente="InformationViz"}
```yaml
modo: wasserstein
p: [1, 0, 0, 0, 0]
q: [0, 0, 0, 0, 1]
```
:::

- **Usar la fórmula de las acumuladas en varias dimensiones.** Fuera de la recta no hay orden natural y el plan óptimo se calcula resolviendo el programa lineal o con aproximaciones como la regularización entrópica.
- **Olvidar la escala.** $W_1$ tiene las unidades de los valores: medir en metros o en kilómetros cambia el número.
- **Confundir $W_1$ con $W_2$.** Con costo cuadrático los envíos largos pesan más; las dos distancias pueden ordenar distinto a los mismos pares de distribuciones.

## Conexiones

Se contrasta con la [[divergencia-de-kullback-leibler]] y la [[divergencia-de-jensen-shannon]], que ignoran la geometría. En la recta se calcula con la [[funcion-de-distribucion-acumulada]], y en general es un problema de [[programacion-lineal]] con su [[dualidad-de-lagrange]]. Las [[divergencias-f]] son la otra gran familia de comparaciones entre distribuciones.

## Formulario

:::formula[Wasserstein de orden 1]
$$
W_1(p, q) = \min_{\gamma \in \Gamma(p, q)} \sum_{i, j}\gamma_{ij}\,|x_i - x_j|
$$

- $\gamma_{ij}$: masa enviada de $x_i$ a $x_j$; $\Gamma(p, q)$: planes con marginales $p$ y $q$; $|x_i - x_j|$: distancia.
:::

:::formula[Forma en la recta]
$$
W_1(p, q) = \int |F_p(x) - F_q(x)|\,dx
$$

- $F_p$, $F_q$: funciones de distribución acumulada; para posiciones equiespaciadas de paso $\Delta$, la integral es $\Delta\sum_i |F_p(x_i) - F_q(x_i)|$.
:::

:::formula[Dualidad de Kantorovich-Rubinstein]
$$
W_1(p, q) = \sup_{\|f\|_{\mathrm{Lip}} \le 1}\big(\mathbb{E}_p[f(X)] - \mathbb{E}_q[f(X)]\big)
$$

- $f$: función con $|f(x) - f(y)| \le |x - y|$; $\|f\|_{\mathrm{Lip}}$: su constante de Lipschitz; $\mathbb{E}_p$, $\mathbb{E}_q$: esperanzas bajo cada distribución.
:::
