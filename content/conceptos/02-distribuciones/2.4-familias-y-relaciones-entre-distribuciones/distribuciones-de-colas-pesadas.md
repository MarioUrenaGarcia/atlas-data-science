---
id: distribuciones-de-colas-pesadas
titulo: Distribuciones de colas pesadas
titulo_en: Heavy-tailed distributions
alias:
  - colas pesadas
  - colas largas
  - colas gruesas
  - leyes de potencia
modulo: 2
submodulo: '2.4'
orden: 11
nivel: intermedio
prerrequisitos:
  - distribucion-de-pareto
  - distribucion-lognormal
relaciones:
  - tipo: contrasta
    id: distribuciones-subgaussianas
  - tipo: relacionado
    id: distribuciones-estables
etiquetas:
  - colas
  - valores extremos
  - ley de potencia
  - riesgo
  - función de supervivencia
resumen: >
  Distribuciones cuya probabilidad de superar un umbral decae más despacio que cualquier exponencial.
  En ellas los valores extremos son frecuentes y pueden dominar sumas y promedios.
formula: '\lim_{t \to \infty} e^{s t}\,P(X > t) = \infty \quad \text{para todo } s > 0'
visualizacion:
  componente: FamilyLab
  parametros:
    modo: colas
    distribuciones: [normal, exponencial, lognormal, pareto]
    valores:
      t: 10
      limite: 20
    casos:
      - nombre: 'Umbral 10'
        descripcion: 'Superar 10: normal 7.6 × 10⁻²⁴, exponencial 4.5 × 10⁻⁵, lognormal 0.011, Pareto 0.032. Solo las dos últimas tienen colas pesadas.'
        valores: {t: 10, limite: 20}
      - nombre: 'Umbral cercano'
        descripcion: 'Cerca del centro las cuatro distribuciones se parecen; las diferencias aparecen lejos.'
        valores: {t: 2, limite: 6}
      - nombre: 'Muy lejos'
        descripcion: 'Con t = 40 la exponencial ya está por debajo de 10⁻⁸ y la Pareto sigue cerca de 0.004.'
        valores: {t: 40, limite: 60}
referencias:
  - clave: coles
  - clave: tsay
  - clave: wasserman
publicado: true
---

## Intuición

Las estaturas de las personas tienen colas ligeras: nadie mide el doble del promedio. Las fortunas, en cambio, tienen colas pesadas: hay personas cuya riqueza es miles de veces la mediana. Lo mismo pasa con el tamaño de las ciudades, las pérdidas de un seguro por catástrofes, las caídas de la bolsa o el número de seguidores en una red social. En esos fenómenos los valores enormes no son anomalías que se puedan ignorar: forman parte normal de la distribución.

La diferencia se ve en cómo cae la probabilidad de superar un umbral. En la normal cae como el exponencial de un cuadrado, tan rápido que superar diez desviaciones es prácticamente imposible. En la exponencial cae en línea recta en escala logarítmica. En las distribuciones de colas pesadas cae más despacio que cualquier exponencial: en una ley de potencia, multiplicar el umbral por diez solo divide la probabilidad entre una constante.

Con colas pesadas, unos cuantos datos pueden dominar la suma total, el promedio muestral se estabiliza muy lentamente o nunca, y la varianza puede ser infinita. Por eso los métodos que suponen normalidad subestiman el riesgo de eventos extremos.

## Definición

:::definicion[Cola pesada]
Una variable $X$ tiene **cola derecha pesada** si su función de supervivencia $\bar{F}(t) = P(X > t)$ decae más lentamente que cualquier exponencial:
$$
\lim_{t \to \infty} e^{s t}\,\bar{F}(t) = \infty \qquad \text{para todo } s > 0,
$$
lo que equivale a que $\mathbb{E}[e^{sX}] = \infty$ para todo $s > 0$.
:::

Un caso importante son las **colas de ley de potencia** (de variación regular): $\bar{F}(t) \approx C\,t^{-\alpha}$ para $t$ grande, con índice de cola $\alpha > 0$. En ellas existen los momentos $\mathbb{E}[X^{k}]$ solo para $k < \alpha$. La Pareto, la t de Student y la Cauchy tienen colas de este tipo; la lognormal tiene cola pesada pero no de ley de potencia.

:::nota[Qué es X]
$X$ = una magnitud que a veces toma valores enormes, como la pérdida de una aseguradora por un siniestro o la riqueza de una persona.
:::

:::nota[Qué hace cada parámetro]
- **$t$, umbral:** el nivel cuya probabilidad de excederse se compara. Si aumenta, las colas pesadas quedan cada vez más arriba de las ligeras en la gráfica.
- **$\alpha$, índice de cola:** en las leyes de potencia, la velocidad de caída. Si aumenta, la cola se adelgaza y existen más momentos.
:::

:::nota[Qué significa cada símbolo]
- $\bar{F}(t)$: función de supervivencia, probabilidad de superar $t$.
- $s$: tasa de una exponencial de comparación; $e^{st}$: crecimiento exponencial.
- $\mathbb{E}[e^{sX}]$: función generadora de momentos.
- $C$: constante; $\alpha$: índice de cola; $k$: orden de un momento.
:::

## Cómo usar la visualización

La gráfica muestra $P(X > t)$ con el eje vertical en escala logarítmica: en ella una exponencial es una recta, la normal es una curva que cae cada vez más rápido y las colas pesadas se curvan hacia arriba de cualquier recta. La línea vertical es el umbral elegido; el panel da la probabilidad de superarlo para cada distribución. Los casos cargan un umbral de 10, uno cercano y uno muy lejano.

Mueve el umbral de 2 a 20 y observa que la normal desaparece de la gráfica antes de 6, mientras la Pareto apenas baja. Amplía el eje a 60 y compara la recta de la exponencial con la curva de la lognormal.

## Ejemplo

Se compara la probabilidad de superar 10 en cuatro distribuciones con escala comparable: normal estándar, exponencial de tasa 1, lognormal con parámetros 0 y 1 y Pareto con mínimo 1 e índice 1.5.

1. Normal: $P(Z > 10) \approx 7.6 \times 10^{-24}$.
2. Exponencial: $P(X > 10) = e^{-10} \approx 4.5 \times 10^{-5}$.
3. Lognormal: $P(X > 10) = P(Z > \log 10) = P(Z > 2.303) \approx 0.011$.
4. Pareto: $P(X > 10) = 10^{-1.5} \approx 0.032$.
5. Con la Pareto, multiplicar el umbral por 10 divide la probabilidad solo entre $10^{1.5} \approx 31.6$: superar 100 tiene probabilidad 0.001. Con la exponencial, pasar de 10 a 100 la divide entre $e^{90}$.

:::figura[Umbral 10 en escala logarítmica: la normal ya salió de la gráfica, la exponencial vale 4.5 × 10⁻⁵ y la lognormal y la Pareto siguen por encima de 0.01.]{componente="FamilyLab"}
```yaml
modo: colas
distribuciones: [normal, exponencial, lognormal, pareto]
valores:
  t: 10
  limite: 20
```
:::

## Propiedades

- **Momentos:** con cola de ley de potencia de índice $\alpha$, la media existe solo si $\alpha > 1$ y la varianza solo si $\alpha > 2$.
- **El máximo domina la suma:** en distribuciones subexponenciales, $P(X_1 + \dots + X_n > t) \approx n\,P(X_1 > t)$ para $t$ grande: una suma grande se debe casi siempre a un solo valor enorme.
- **Promedios inestables:** si la varianza es infinita, el promedio muestral converge muy lentamente; si la media es infinita, como en la Cauchy, no converge.
- **Teorema central del límite:** con varianza infinita las sumas normalizadas tienden a una distribución estable, no a la normal.
- **Escala logarítmica:** en un gráfico log-log de la supervivencia, una ley de potencia es una recta de pendiente $-\alpha$.
- **Máximos:** los máximos de colas de ley de potencia tienden a la distribución de Fréchet.

:::figura[Casos con contexto (umbral 10, umbral cercano, muy lejos): cada botón carga el umbral y el ancho del eje, y una frase compara las colas.]{componente="FamilyLab"}
```yaml
modo: colas
distribuciones: [normal, exponencial, lognormal, pareto]
valores:
  t: 2
  limite: 6
casos:
  - nombre: 'Umbral 10'
    descripcion: 'Solo lognormal y Pareto siguen visibles.'
    valores: {t: 10, limite: 20}
  - nombre: 'Umbral cercano'
    descripcion: 'Cerca del centro se parecen.'
    valores: {t: 2, limite: 6}
  - nombre: 'Muy lejos'
    descripcion: 'La Pareto domina.'
    valores: {t: 40, limite: 60}
```
:::

:::figura[Colas de ley de potencia con y sin media: la t con 3 grados y la Cauchy caen como rectas en log-log; la Cauchy, con índice 1, está siempre por encima y no tiene media.]{componente="FamilyLab"}
```yaml
modo: colas
distribuciones: [normal, t3, cauchy, pareto]
valores:
  t: 20
  limite: 60
```
:::

## Errores comunes

- **Juzgar las colas por el histograma.** En escala lineal todas las colas parecen pegarse al cero; las diferencias solo se ven en escala logarítmica.
- **Usar la normal para eventos extremos.** Con datos de colas pesadas, la normal subestima por órdenes de magnitud la probabilidad de pérdidas grandes.
- **Confiar en la varianza muestral.** Si la varianza poblacional es infinita, la muestral crece sin estabilizarse al agregar datos.
- **Confundir asimetría con cola pesada.** La exponencial es asimétrica pero de cola ligera; la t es simétrica y de cola pesada.

:::figura[Simétrica y pesada: la t con 3 grados es simétrica como la normal, pero en el umbral 6 su cola es millones de veces mayor.]{componente="FamilyLab"}
```yaml
modo: colas
distribuciones: [normal, t3, exponencial]
valores:
  t: 6
  limite: 15
```
:::

## Conexiones

La [[distribucion-de-pareto]], la [[distribucion-de-cauchy]], la [[distribucion-t-de-student]] y la [[distribucion-lognormal]] tienen colas pesadas; la [[distribucion-exponencial]] marca la frontera y la [[distribucion-normal]] tiene cola ligera. Con varianza infinita, las sumas tienden a las [[distribuciones-estables]] y no a la normal, como se discute en [[cuando-el-tcl-falla]]. Sus máximos siguen la [[distribucion-de-frechet]]. En el extremo opuesto están las [[distribuciones-subgaussianas]], con colas tan ligeras como la normal o más. El [[mapa-de-relaciones-entre-distribuciones]] reúne estas familias.

## Formulario

:::formula[Definición de cola pesada]
$$
\lim_{t \to \infty} e^{s t}\,P(X > t) = \infty \quad \forall s > 0
$$

- $t$: umbral; $s$: tasa de comparación.
:::

:::formula[Ley de potencia]
$$
P(X > t) \approx C\,t^{-\alpha}, \qquad \mathbb{E}[X^{k}] < \infty \iff k < \alpha
$$

- $C$: constante; $\alpha$: índice de cola; $k$: orden del momento.
:::

:::formula[Pareto]
$$
P(X > t) = \left(\frac{x_m}{t}\right)^{\alpha}, \qquad t \ge x_m
$$

- $x_m$: valor mínimo; con $x_m = 1$ y $\alpha = 1.5$, $P(X > 10) = 10^{-1.5}$.
:::

:::formula[El máximo domina la suma]
$$
P(X_1 + \dots + X_n > t) \sim n\,P(X_1 > t), \qquad t \to \infty
$$

- Vale para distribuciones subexponenciales; $n$: número de sumandos independientes.
:::
