---
id: distribucion-de-zipf
titulo: Distribución de Zipf
titulo_en: Zipf distribution
alias:
  - ley de Zipf
  - distribución rango-frecuencia
  - Zipf's law
modulo: 2
submodulo: '2.1'
orden: 11
nivel: intermedio
prerrequisitos:
  - distribucion-categorica
  - series-y-convergencia-de-series
relaciones:
  - tipo: relacionado
    id: distribucion-uniforme-discreta
etiquetas:
  - distribución discreta
  - ley de potencia
  - rango y frecuencia
  - escala log-log
resumen: >
  Asigna al elemento de rango k una probabilidad proporcional a 1/k^s. Describe frecuencias de palabras,
  visitas a páginas o tamaños de ciudades: pocos elementos concentran gran parte de los casos.
formula: 'P(K = k) = \frac{k^{-s}}{H_{N,s}}, \quad H_{N,s} = \sum_{j=1}^{N} j^{-s}'
visualizacion:
  componente: DistributionGenesis
  parametros:
    proceso: ranking
    valores:
      N: 30
      s: 1
    etiquetas: [de, la, que, el, en, y, a, los, se, del, las, un]
referencias:
  - clave: newman
  - clave: murphy
publicado: true
---

## Intuición

En cualquier texto largo en español, la palabra más frecuente, "de", aparece muchísimas veces; la segunda, "la", aparece más o menos la mitad; la tercera, un tercio, y así sucesivamente. Si se ordenan las palabras de la más común a la más rara y se anota su lugar en esa lista, su rango, la frecuencia resulta aproximadamente inversamente proporcional al rango. Esta regularidad se llama ley de Zipf.

La distribución de Zipf convierte esa regularidad en un modelo de probabilidad: al tomar una palabra al azar del texto, la probabilidad de que tenga rango $k$ es proporcional a $1/k$, o en general a $1/k^{s}$ con un exponente $s$. El resultado es muy desigual: unos cuantos elementos acaparan buena parte de los casos y una larga cola de elementos raros reparte el resto.

La misma forma aparece en las visitas a páginas de un sitio web, en las ventas de productos de una tienda en línea, en las poblaciones de ciudades o en las citas de artículos científicos. Su huella más reconocible es que, al graficar la frecuencia contra el rango en escala logarítmica en ambos ejes, los puntos caen sobre una recta con pendiente $-s$.

## Definición

:::definicion[Distribución de Zipf]
Sean $N \ge 1$ un entero y $s \ge 0$. Una variable $K$ con valores en $\{1, \dots, N\}$ tiene **distribución de Zipf**, $K \sim \operatorname{Zipf}(N, s)$, si
$$
P(K = k) = \frac{k^{-s}}{H_{N,s}}, \qquad H_{N,s} = \sum_{j=1}^{N} \frac{1}{j^{s}}.
$$
:::

El denominador $H_{N,s}$, el número armónico generalizado, hace que las probabilidades sumen uno. Con infinitos rangos, $N = \infty$, la suma converge solo si $s > 1$ y el denominador es la función zeta de Riemann $\zeta(s)$; esa versión se llama distribución zeta.

:::nota[Qué significa cada símbolo]
- $K$: rango del elemento elegido; 1 es el más frecuente.
- $k$: un rango particular.
- $N$: número de elementos distintos.
- $s$: exponente; controla qué tan rápido cae la probabilidad con el rango.
- $H_{N,s}$: número armónico generalizado, la constante de normalización.
- $j$: índice de la suma.
- $\zeta(s)$: función zeta, $\sum_{j \ge 1} j^{-s}$.
:::

## Cómo usar la visualización

Las barras de arriba son las palabras ordenadas por rango, con altura proporcional a $k^{-s}$. Cada extracción toma una palabra al azar e ilumina su barra; el rango obtenido se acumula en el histograma de abajo. La pestaña "Escala log-log" dibuja la frecuencia contra el rango con ambos ejes logarítmicos.

Con $s = 1$ casi un cuarto de las extracciones es la palabra "de" y las primeras diez palabras reúnen el 73 % de los casos. En la vista log-log la curva teórica es una recta de pendiente $-1$ y los puntos simulados la siguen en los primeros rangos, con más ruido en la cola. Al bajar $s$ a 0 todas las palabras son igual de probables; al subirlo a 2 casi todo se concentra en las tres primeras.

## Ejemplo

Un sitio web tiene 50 páginas y la probabilidad de que una visita vaya a la página de rango $k$ sigue $\operatorname{Zipf}(50, 1)$.

1. Constante: $H_{50,1} = 1 + \frac{1}{2} + \dots + \frac{1}{50} \approx 4.499$.
2. La página principal recibe $1/4.499 \approx 0.222$ de las visitas.
3. La página de rango 10 recibe $\frac{1/10}{4.499} \approx 0.022$, diez veces menos que la principal.
4. Las cinco páginas más visitadas reúnen $H_{5,1}/H_{50,1} = 2.283/4.499 \approx 0.507$: la mitad del tráfico.
5. Rango medio: $\mathbb{E}[K] = H_{50,0}/H_{50,1} = 50/4.499 \approx 11.1$.

:::figura[Zipf(50, 1): las cinco primeras barras, sombreadas, suman 0.507. La primera mide 0.222.]{componente="DistributionExplorer"}
```yaml
distribucion: zipf
valores:
  N: 50
  s: 1
desde: 1
hasta: 5
muestras: false
```
:::

:::figura[Las visitas al sitio simuladas una por una: la página de rango 1 se ilumina con mucha más frecuencia que las demás.]{componente="DistributionGenesis"}
```yaml
proceso: ranking
valores:
  N: 50
  s: 1
etiquetas: [Inicio, Productos, Precios, Contacto, Ayuda]
```
:::

## Propiedades

- **Cociente de probabilidades:** $\dfrac{P(K = 1)}{P(K = k)} = k^{s}$; con $s = 1$ el rango $k$ es $k$ veces menos probable que el primero.
- **Recta en escala log-log:** $\log P(K = k) = -s \log k - \log H_{N,s}$, una recta de pendiente $-s$.
- **Caso uniforme:** con $s = 0$ todos los rangos tienen probabilidad $1/N$.
- **Concentración:** al aumentar $s$ la masa se concentra en los primeros rangos.
- **Momentos:** $\mathbb{E}[K] = H_{N,s-1}/H_{N,s}$ y $\mathbb{E}[K^{2}] = H_{N,s-2}/H_{N,s}$.
- **Versión infinita:** con $N = \infty$ la media existe solo si $s > 2$ y la varianza solo si $s > 3$.

:::figura[En escala log-log la ley de Zipf es una recta de pendiente -s. Los puntos simulados se alinean en los primeros rangos y se dispersan en la cola.]{componente="DistributionGenesis"}
```yaml
proceso: ranking
valores:
  N: 100
  s: 1
vista: loglog
```
:::

:::figura[Con s = 0 la distribución es uniforme: las 30 barras miden 1/30.]{componente="DistributionExplorer"}
```yaml
distribucion: zipf
valores:
  N: 30
  s: 0
muestras: false
```
:::

:::figura[Con s = 2 la concentración es extrema: el primer rango tiene 0.62 y los cinco primeros, el 90 %.]{componente="DistributionExplorer"}
```yaml
distribucion: zipf
valores:
  N: 50
  s: 2
desde: 1
hasta: 5
muestras: false
```
:::

## Errores comunes

- **Ajustar la recta en log-log con toda la cola.** Los rangos altos se observan pocas veces y sus frecuencias son muy ruidosas; una regresión que los trata igual que a los primeros distorsiona la estimación de $s$.
- **Confundir rango con valor.** $K$ es una posición en una lista ordenada, no una medida como la población de una ciudad; la ley análoga para valores es la de Pareto.
- **Olvidar la normalización.** $1/k$ no es una probabilidad: hay que dividir entre $H_{N,s}$, y con $N = \infty$ y $s \le 1$ la serie diverge.
- **Esperar ver pocas categorías en una muestra.** Aunque los primeros rangos dominan, la cola es larga y en muestras grandes aparecen muchos elementos raros.

:::figura[Ruido en la cola: con pocas extracciones, los rangos altos aparecen cero o una vez, y en la vista log-log sus puntos quedan muy por encima o desaparecen.]{componente="DistributionGenesis"}
```yaml
proceso: ranking
valores:
  N: 100
  s: 1.2
vista: loglog
semilla: 7
```
:::

## Conexiones

La Zipf es una [[distribucion-categorica]] cuyas probabilidades siguen una ley de potencia en el rango; con $s = 0$ se reduce a la [[distribucion-uniforme-discreta]]. Su normalización es una suma armónica, y la versión infinita requiere la convergencia de una [[series-y-convergencia-de-series|serie]] $p$. Es la contraparte discreta de la distribución de Pareto y aparece en el análisis de redes con distribuciones de grado de cola pesada. Junto con la [[distribucion-logaritmica]], se usa para describir abundancias muy desiguales.

## Formulario

:::formula[Función de masa]
$$
P(K = k) = \frac{k^{-s}}{H_{N,s}}, \qquad k = 1, \dots, N
$$

- $K$: rango del elemento elegido.
- $s$: exponente.
- $N$: número de elementos.
:::

:::formula[Número armónico generalizado]
$$
H_{N,s} = \sum_{j=1}^{N} \frac{1}{j^{s}}
$$

- $j$: rango que se suma.
- Con $N = \infty$ y $s > 1$ es la función zeta $\zeta(s)$.
:::

:::formula[Forma log-log]
$$
\log P(K = k) = -s \log k - \log H_{N,s}
$$

- $\log$: logaritmo natural.
- $-s$: pendiente de la recta.
:::

:::formula[Momentos]
$$
\mathbb{E}[K] = \frac{H_{N,s-1}}{H_{N,s}}, \qquad \operatorname{Var}(K) = \frac{H_{N,s-2}}{H_{N,s}} - \left(\frac{H_{N,s-1}}{H_{N,s}}\right)^{2}
$$

- $H_{N,s-1}$, $H_{N,s-2}$: números armónicos con exponentes reducidos.
:::
