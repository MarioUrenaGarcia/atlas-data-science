---
id: divergencias-f
titulo: Divergencias f
titulo_en: f-divergences
alias:
  - divergencias de Csiszár
  - f-divergencia
  - divergencias de Ali-Silvey
modulo: 0
submodulo: '0.8'
orden: 17
nivel: avanzado
prerrequisitos:
  - divergencia-de-kullback-leibler
  - funciones-convexas-y-concavas
relaciones:
  - tipo: generaliza
    id: divergencia-de-kullback-leibler
  - tipo: generaliza
    id: divergencia-de-jensen-shannon
etiquetas:
  - divergencias
  - convexidad
  - comparación de distribuciones
  - cociente de verosimilitudes
resumen: >
  Una divergencia f promedia, con los pesos de q, una función convexa f del cociente p/q con f(1) = 0.
  KL, KL inversa, variación total, Hellinger y chi cuadrada son casos de la misma familia.
formula: 'D_f(p \,\|\, q) = \sum_{x} q(x)\, f\!\left(\frac{p(x)}{q(x)}\right), \qquad f \text{ convexa}, \ f(1) = 0'
visualizacion:
  componente: InformationViz
  parametros:
    modo: divergencias-f
    p: [0.5, 0.3, 0.2]
    q: [0.2, 0.4, 0.4]
    f: kl
referencias:
  - clave: murphy
  - clave: cover-thomas
publicado: true
---

## Intuición

Para comparar una distribución $p$ con otra $q$ se puede mirar, en cada valor $x$, el cociente $t = p(x)/q(x)$. Si las distribuciones coinciden, todos los cocientes valen 1. Cuanto más se alejan de 1, más se distinguen las distribuciones en ese punto. Una divergencia f convierte cada cociente en un costo con una función $f$ que vale cero en 1 y crece al alejarse, y promedia esos costos con los pesos de $q$.

La elección de $f$ decide qué se castiga. La de Kullback-Leibler, $t \log t$, castiga mucho los cocientes grandes, los lugares donde $q$ subestima a $p$. La chi cuadrada, $(t - 1)^2$, los castiga todavía más. La variación total, $\tfrac{1}{2}|t - 1|$, es lineal y tolerante. Hellinger queda en medio. Como $f$ es convexa, todas cumplen lo que se espera de una divergencia: son no negativas y valen cero solo si $p = q$.

## Definición

:::definicion[Divergencia f]
Sea $f : (0, \infty) \to \mathbb{R}$ convexa con $f(1) = 0$, y sean $p$ y $q$ distribuciones sobre $\mathcal{X}$ con $q(x) > 0$ para todo $x$. La divergencia f de $p$ respecto de $q$ es
$$
D_f(p \,\|\, q) = \sum_{x \in \mathcal{X}} q(x)\, f\!\left(\frac{p(x)}{q(x)}\right).
$$
Si $q(x) = 0 < p(x)$, el término se define como $p(x) \lim_{t \to \infty} f(t)/t$, que puede ser finito o infinito.
:::

Generadores usuales, con logaritmo natural:

| Divergencia | $f(t)$ |
| --- | --- |
| Kullback-Leibler | $t \log t$ |
| Kullback-Leibler inversa | $-\log t$ |
| Variación total | $\tfrac{1}{2}\lvert t - 1\rvert$ |
| Hellinger al cuadrado | $(\sqrt{t} - 1)^2$ |
| Chi cuadrada de Pearson | $(t - 1)^2$ |

:::nota[Qué significa cada símbolo]
- $p$, $q$: distribuciones que se comparan.
- $\mathcal{X}$: conjunto de valores.
- $f$: generador, función convexa que vale cero en 1.
- $t$: cociente $p(x)/q(x)$.
- $D_f(p \,\|\, q)$: divergencia f, en nats con logaritmo natural.
- $\log$: logaritmo natural.
:::

## Cómo usar la visualización

La curva es el generador $f(t)$ elegido en el control y la línea punteada marca $t = 1$. Cada punto es el cociente $p(x)/q(x)$ de un valor, colocado sobre la curva, con tamaño según $q(x)$. El encabezado escribe la suma $\sum q\,f(p/q)$; las lecturas dan las cinco divergencias a la vez. La reproducción lleva $q$ hacia $p$.

Al inicio los cocientes son 2.5, 0.75 y 0.5, y las divergencias valen 0.233 (KL), 0.209 (KL inversa), 0.3 (variación total), 0.109 (Hellinger) y 0.575 (chi cuadrada). Al avanzar, los puntos se deslizan hacia $t = 1$, donde todas las curvas valen cero, y las cinco lecturas bajan juntas.

## Ejemplo

Se comparan $p = (0.5, 0.3, 0.2)$ y $q = (0.2, 0.4, 0.4)$, las proporciones de tres tipos de falla en dos plantas de manufactura.

1. Cocientes: $t = (2.5, 0.75, 0.5)$.
2. Chi cuadrada: $0.2(1.5)^2 + 0.4(0.25)^2 + 0.4(0.5)^2 = 0.45 + 0.025 + 0.1 = 0.575$.
3. Variación total: $\tfrac{1}{2}(0.2 \cdot 1.5 + 0.4 \cdot 0.25 + 0.4 \cdot 0.5) = \tfrac{1}{2}(0.3 + 0.1 + 0.2) = 0.3$.
4. Hellinger: $0.2(\sqrt{2.5} - 1)^2 + 0.4(\sqrt{0.75} - 1)^2 + 0.4(\sqrt{0.5} - 1)^2 = 0.068 + 0.007 + 0.034 = 0.109$.
5. Kullback-Leibler: $0.2 \cdot 2.5 \log 2.5 + 0.4 \cdot 0.75 \log 0.75 + 0.4 \cdot 0.5 \log 0.5 = 0.458 - 0.086 - 0.139 = 0.233$ nats.

:::figura[Las mismas plantas con el generador de chi cuadrada: el cociente 2.5 queda alto sobre la parábola y aporta 0.45 de los 0.575 totales.]{componente="InformationViz"}
```yaml
modo: divergencias-f
p: [0.5, 0.3, 0.2]
q: [0.2, 0.4, 0.4]
f: chi-cuadrada
```
:::

## Propiedades

- **No negatividad:** por la desigualdad de Jensen, $D_f(p \,\|\, q) \ge f\big(\sum_x q(x) \tfrac{p(x)}{q(x)}\big) = f(1) = 0$; si $f$ es estrictamente convexa en 1, la igualdad exige $p = q$.
- **Procesamiento de datos:** aplicar el mismo canal a $p$ y a $q$ no aumenta ninguna divergencia f.
- **Generador del sentido inverso:** $D_f(q \,\|\, p) = D_{f^*}(p \,\|\, q)$ con $f^*(t) = t\,f(1/t)$; por eso KL y KL inversa son la misma familia.
- **Simetría solo en casos particulares:** la variación total y Hellinger son simétricas; la chi cuadrada no.

:::figura[Las plantas con los papeles invertidos y el generador de variación total: la lectura sigue en 0.3, mientras la chi cuadrada pasa de 0.575 a 0.413.]{componente="InformationViz"}
```yaml
modo: divergencias-f
p: [0.2, 0.4, 0.4]
q: [0.5, 0.3, 0.2]
f: variacion-total
```
:::

- **Desigualdad de Pinsker:** $\mathrm{TV}(p, q) \le \sqrt{\tfrac{1}{2} D_{\mathrm{KL}}(p \,\|\, q)}$, con la divergencia en nats.
- **Jensen-Shannon:** también es una divergencia f, con $f(t) = \tfrac{1}{2}\big(t \log t - (1 + t)\log\tfrac{1 + t}{2}\big)$.

## Errores comunes

- **Creer que todas son infinitas cuando los soportes no coinciden.** La variación total, Hellinger y la Kullback-Leibler inversa siguen finitas si $q$ no cubre todo el soporte de $p$, porque su generador crece a lo más linealmente.

:::figura[Una planta con fallas del tercer tipo, (0.4, 0.3, 0.3), contra otra sin ellas, (0.5, 0.5, 0): el cociente del tercer tipo es infinito, KL y chi cuadrada lo son también, pero Hellinger marca 0.331 y la variación total 0.3.]{componente="InformationViz"}
```yaml
modo: divergencias-f
p: [0.4, 0.3, 0.3]
q: [0.5, 0.5, 0]
f: hellinger
```
:::

- **Mezclar convenciones de Hellinger.** Algunos textos incluyen un factor $\tfrac{1}{2}$ y otros toman la raíz; los valores no son comparables sin aclararlo.
- **Pensar que la distancia de Wasserstein pertenece a la familia.** Las divergencias f solo dependen de los cocientes de probabilidades, no de dónde están los valores; Wasserstein sí usa la geometría y no es una divergencia f.
- **Sumar los términos $p\,f(p/q)$ en lugar de $q\,f(p/q)$.** Los pesos del promedio son los de $q$.

## Conexiones

Generaliza la [[divergencia-de-kullback-leibler]] y la [[divergencia-de-jensen-shannon]] con generadores de [[funciones-convexas-y-concavas]]. Explica la [[asimetria-de-la-divergencia-kl]] como la diferencia entre los generadores $t \log t$ y $-\log t$, y cumple la versión para divergencias de la [[desigualdad-de-procesamiento-de-datos]]. La [[distancia-de-wasserstein-y-transporte-optimo]] es la alternativa geométrica.

## Formulario

:::formula[Divergencia f]
$$
D_f(p \,\|\, q) = \sum_x q(x)\,f\!\left(\frac{p(x)}{q(x)}\right)
$$

- $p$, $q$: distribuciones; $f$: función convexa con $f(1) = 0$; $p(x)/q(x)$: cociente en cada valor.
:::

:::formula[Generadores]
$$
t\log t, \qquad -\log t, \qquad \tfrac{1}{2}|t - 1|, \qquad (\sqrt{t} - 1)^2, \qquad (t - 1)^2
$$

- En orden: Kullback-Leibler, Kullback-Leibler inversa, variación total, Hellinger al cuadrado y chi cuadrada; $t$: cociente de probabilidades.
:::

:::formula[Sentido inverso]
$$
D_f(q \,\|\, p) = D_{f^*}(p \,\|\, q), \qquad f^*(t) = t\,f(1/t)
$$

- $f^*$: generador conjugado, también convexo y con $f^*(1) = 0$.
:::

:::formula[Desigualdad de Pinsker]
$$
\mathrm{TV}(p, q) \le \sqrt{\tfrac{1}{2}D_{\mathrm{KL}}(p \,\|\, q)}
$$

- $\mathrm{TV}$: variación total; $D_{\mathrm{KL}}$: divergencia de Kullback-Leibler en nats.
:::
